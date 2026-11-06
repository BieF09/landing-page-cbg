import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, watchPct, requestHrInterview } = body;

    if (!leadId) {
      return NextResponse.json({ error: "leadId requerido" }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return NextResponse.json({ error: "Candidato no encontrado" }, { status: 404 });
    }

    const newPct = Math.max(lead.webinarWatchPct, Number(watchPct || 0));
    const shouldPromoteToHr =
      requestHrInterview ||
      (newPct >= 80 &&
        (lead.stage === "POOL" ||
          lead.stage === "CONTACTED_WEBINAR_SENT" ||
          lead.stage === "WEBINAR_WATCHED"));

    const updated = await prisma.lead.update({
      where: { id: leadId },
      data: {
        webinarOpenedAt: lead.webinarOpenedAt || new Date(),
        webinarWatchPct: newPct,
        ...(requestHrInterview ? { requestedHrInterview: true } : {}),
        ...(shouldPromoteToHr ? { stage: "READY_FOR_HR" } : {}),
      },
    });

    if (requestHrInterview) {
      await prisma.leadActivity.create({
        data: {
          leadId,
          actionType: "WEBINAR_PROGRESS",
          description: `🔥 ${lead.firstName} ${lead.lastName} vio el Webinar (${newPct}%) y presionó el botón para solicitar Entrevista con Recursos Humanos.`,
        },
      });
    } else if (watchPct && watchPct > lead.webinarWatchPct && (watchPct === 25 || watchPct === 50 || watchPct === 100)) {
      await prisma.leadActivity.create({
        data: {
          leadId,
          actionType: "WEBINAR_PROGRESS",
          description: `Candidato alcanzó el ${newPct}% de reproducción del Webinar grabado.`,
        },
      });
    }

    return NextResponse.json({ ok: true, lead: updated });
  } catch (error) {
    console.error("POST /api/webinar-tracking error:", error);
    return NextResponse.json({ error: "Error registrando telemetría de webinar" }, { status: 500 });
  }
}

