import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ItinRuleStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    const leader = await prisma.leaderProfile.findFirst();
    if (!leader) {
      return NextResponse.json({ error: "Perfil de líder no encontrado" }, { status: 404 });
    }

    if (action === "UPDATE_PROFILE") {
      const { fullName, title, agencyName, whatsappNumber, webinarVideoUrl, webinarTitle, heroHeadline } = body;
      const updated = await prisma.leaderProfile.update({
        where: { id: leader.id },
        data: {
          fullName,
          title,
          agencyName,
          whatsappNumber,
          webinarVideoUrl,
          webinarTitle,
          heroHeadline,
        },
      });
      return NextResponse.json({ ok: true, leader: updated });
    }

    if (action === "UPSERT_ITIN_RULE") {
      const { stateCode, stateName, cityNotes, status } = body;
      const rule = await prisma.itinJurisdiction.upsert({
        where: {
          leaderId_stateCode: {
            leaderId: leader.id,
            stateCode: stateCode.toUpperCase(),
          },
        },
        update: {
          stateName,
          cityNotes,
          status: status as ItinRuleStatus,
        },
        create: {
          leaderId: leader.id,
          stateCode: stateCode.toUpperCase(),
          stateName,
          cityNotes,
          status: status as ItinRuleStatus,
        },
      });
      return NextResponse.json({ ok: true, rule });
    }

    if (action === "UPDATE_TEMPLATE") {
      const { id, name, body: templateBody } = body;
      const updated = await prisma.whatsappTemplate.update({
        where: { id },
        data: { name, body: templateBody },
      });
      return NextResponse.json({ ok: true, template: updated });
    }

    return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/settings error:", error);
    return NextResponse.json({ error: "Error guardando configuración" }, { status: 500 });
  }
}

