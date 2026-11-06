import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateCandidateEligibility } from "@/lib/eligibility";
import { DocumentStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const leadType = searchParams.get("leadType");

    const leader = await prisma.leaderProfile.findFirst();
    if (!leader) {
      return NextResponse.json({ leads: [] });
    }

    const leads = await prisma.lead.findMany({
      where: {
        leaderId: leader.id,
        ...(leadType ? { leadType: leadType as "RECRUITMENT" | "CLIENT" } : {}),
      },
      include: {
        campaign: true,
        assignedAgent: true,
        activities: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error("GET /api/leads error:", error);
    return NextResponse.json({ error: "Error al obtener leads" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      leadType = "RECRUITMENT",
      firstName,
      lastName,
      phone,
      email,
      state,
      city,
      documentStatus = "NONE",
      campaignCode,
      quizAnswers,
    } = body;

    if (!firstName || !phone || !state) {
      return NextResponse.json(
        { error: "Nombre, teléfono y estado son obligatorios." },
        { status: 400 }
      );
    }

    const leader = await prisma.leaderProfile.findFirst();
    if (!leader) {
      return NextResponse.json({ error: "Perfil de líder no configurado" }, { status: 500 });
    }

    // Buscar campaña si viene con código de red social (?src=...)
    let campaignId: string | null = null;
    if (campaignCode) {
      const campaign = await prisma.campaign.findUnique({
        where: { code: campaignCode },
      });
      if (campaign) {
        campaignId = campaign.id;
      }
    }

    // Si es un Lead de Cliente de Póliza (Embudo B)
    if (leadType === "CLIENT") {
      const clientLead = await prisma.lead.create({
        data: {
          leaderId: leader.id,
          campaignId,
          leadType: "CLIENT",
          firstName,
          lastName: lastName || "",
          phone,
          email: email || null,
          state,
          city: city || null,
          documentStatus: "NOT_APPLICABLE",
          qualification: "CLIENT_LEAD",
          stage: "CLIENT_NEW",
          quizAnswers: quizAnswers || {},
          notes: "Solicitó asesoría de Protección Familiar desde la Landing Page.",
        },
      });

      await prisma.leadActivity.create({
        data: {
          leadId: clientLead.id,
          actionType: "CREATED",
          description: `Cliente potencial registrado para Protección Familiar en ${state}.`,
        },
      });

      return NextResponse.json({
        ok: true,
        lead: clientLead,
        eligibility: {
          qualification: "CLIENT_LEAD",
          badgeLabel: "🛡️ Solicitud de Protección Familiar Recibida",
          userMessage:
            "Hemos recibido tu solicitud. Luis Andrés Salazar o un especialista certificado de su equipo te contactará muy pronto para brindarte tu asesoría gratuita.",
        },
      });
    }

    // Si es un Lead de Reclutamiento de Agentes (Embudo A)
    const itinRule = await prisma.itinJurisdiction.findUnique({
      where: {
        leaderId_stateCode: {
          leaderId: leader.id,
          stateCode: state.toUpperCase(),
        },
      },
    });

    const eligibility = evaluateCandidateEligibility({
      documentStatus: documentStatus as DocumentStatus,
      state: state.toUpperCase(),
      itinStateRule: itinRule?.status || null,
    });

    const newLead = await prisma.lead.create({
      data: {
        leaderId: leader.id,
        campaignId,
        leadType: "RECRUITMENT",
        firstName,
        lastName: lastName || "",
        phone,
        email: email || null,
        state: state.toUpperCase(),
        city: city || null,
        documentStatus: documentStatus as DocumentStatus,
        qualification: eligibility.qualification,
        stage: eligibility.initialStage,
        quizAnswers: quizAnswers || {},
        notes:
          eligibility.qualification === "DISQUALIFIED_DOCS"
            ? "Filtrado automáticamente por el Quiz (No cuenta con SSN ni ITIN)."
            : `Pre-calificado como ${eligibility.badgeLabel}.`,
      },
    });

    await prisma.leadActivity.create({
      data: {
        leadId: newLead.id,
        actionType: "CREATED",
        description: `Aplicó desde la Landing Page. Resultado del motor: ${eligibility.badgeLabel}.`,
      },
    });

    return NextResponse.json({
      ok: true,
      lead: newLead,
      eligibility,
    });
  } catch (error) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json({ error: "Error al registrar la aplicación" }, { status: 500 });
  }
}

