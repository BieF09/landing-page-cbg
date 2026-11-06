import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { ActivityActionType, LeadStage } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentSession();
    const leadId = params.id;
    const body = await req.json();

    const {
      stage,
      incrementCallAttempt,
      notes,
      hrChecklist,
      assignedAgentId,
      activityType,
      activityDescription,
    } = body;

    const existing = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!existing) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
    }

    const updated = await prisma.lead.update({
      where: { id: leadId },
      data: {
        ...(stage ? { stage: stage as LeadStage } : {}),
        ...(incrementCallAttempt ? { callAttempts: { increment: 1 } } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(hrChecklist !== undefined ? { hrChecklist } : {}),
        ...(assignedAgentId !== undefined ? { assignedAgentId } : {}),
      },
      include: {
        campaign: true,
        assignedAgent: true,
      },
    });

    if (activityDescription) {
      await prisma.leadActivity.create({
        data: {
          leadId,
          userId: session?.id || null,
          actionType: (activityType as ActivityActionType) || "STAGE_CHANGE",
          description: activityDescription,
        },
      });
    }

    return NextResponse.json({ ok: true, lead: updated });
  } catch (error) {
    console.error("PATCH /api/leads/[id] error:", error);
    return NextResponse.json({ error: "Error actualizando el lead" }, { status: 500 });
  }
}

