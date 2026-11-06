import React from "react";
import { prisma } from "@/lib/prisma";
import HrPipelineClient from "@/components/crm/HrPipelineClient";

export const dynamic = "force-dynamic";

export default async function RrhhPage() {
  const leader = await prisma.leaderProfile.findFirst();

  const leads = await prisma.lead.findMany({
    where: {
      leadType: "RECRUITMENT",
      stage: {
        in: [
          "READY_FOR_HR",
          "HR_INTERVIEWED",
          "ENROLLED_LICENSING",
          "ACTIVE_AGENT",
        ],
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const templates = await prisma.whatsappTemplate.findMany({
    where: { targetRole: "HR" },
  });

  const hrInterviewTemplate =
    templates[0]?.body ||
    "¡Felicidades {{nombre}}! 🎯 Vimos que ya completaste la Presentación Oficial de Negocio de Carta Business Group. Soy del área de Recursos Humanos del equipo de {{lider}}. ¿Tienes disponibilidad hoy para tu entrevista de selección de 15 minutos?";

  const enrolledTemplate =
    templates[1]?.body ||
    "¡Bienvenido oficialmente al proceso de Licencia Estatal en {{estado}}, {{nombre}}! 🚀";

  const serializedLeads = leads.map((l) => ({
    id: l.id,
    firstName: l.firstName,
    lastName: l.lastName,
    phone: l.phone,
    email: l.email,
    state: l.state,
    city: l.city,
    documentStatus: l.documentStatus,
    qualification: l.qualification,
    stage: l.stage,
    webinarWatchPct: l.webinarWatchPct,
    requestedHrInterview: l.requestedHrInterview,
    hrChecklist: (l.hrChecklist as Record<string, boolean> | null) || null,
    notes: l.notes,
  }));

  return (
    <HrPipelineClient
      initialLeads={serializedLeads}
      leaderName={leader?.fullName || "Luis Andrés Salazar"}
      hrInterviewTemplate={hrInterviewTemplate}
      enrolledTemplate={enrolledTemplate}
    />
  );
}

