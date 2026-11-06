import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CampaignPlatform, TargetFunnel } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, name, code, platform, targetFunnel } = body;

    const leader = await prisma.leaderProfile.findFirst();
    if (!leader) {
      return NextResponse.json({ error: "Líder no encontrado" }, { status: 404 });
    }

    if (action === "INCREMENT_CLICK" && code) {
      await prisma.campaign.updateMany({
        where: { code },
        data: { clicksCount: { increment: 1 } },
      });
      return NextResponse.json({ ok: true });
    }

    if (!name || !code) {
      return NextResponse.json({ error: "Nombre y código de campaña requeridos" }, { status: 400 });
    }

    const cleanCode = code
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "-");

    const campaign = await prisma.campaign.create({
      data: {
        leaderId: leader.id,
        name,
        code: cleanCode,
        platform: (platform as CampaignPlatform) || "INSTAGRAM",
        targetFunnel: (targetFunnel as TargetFunnel) || "RECRUITMENT",
      },
    });

    return NextResponse.json({ ok: true, campaign });
  } catch (error) {
    console.error("POST /api/campaigns error:", error);
    return NextResponse.json({ error: "Error creando campaña (verifica que el código no esté repetido)" }, { status: 500 });
  }
}

