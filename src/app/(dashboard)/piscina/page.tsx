import React from "react";
import { prisma } from "@/lib/prisma";
import AssistantPoolClient from "@/components/crm/AssistantPoolClient";

export const dynamic = "force-dynamic";

export default async function PiscinaPage() {
  const leader = await prisma.leaderProfile.findFirst();

  const leads = await prisma.lead.findMany({
    where: {
      leadType: "RECRUITMENT",
      qualification: {
        not: "DISQUALIFIED_DOCS",
      },
      stage: {
        in: ["POOL", "CONTACTED_WEBINAR_SENT", "WEBINAR_WATCHED"],
      },
    },
    include: {
      campaign: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const templates = await prisma.whatsappTemplate.findMany({
    where: { targetRole: "ASSISTANT" },
  });

  const defaultTemplate =
    templates[0]?.body ||
    "¡Hola {{nombre}}! 👋 Te saluda la oficina de *{{lider}}* en *Carta Business Group (Globe Life)*. Recibimos tu aplicación en {{estado}}. Aquí tienes tu acceso exclusivo al Webinar de Presentación Oficial de Negocio: {{link_webinar}}";

  const followupTemplate =
    templates[1]?.body || defaultTemplate;

  const serializedLeads = leads.map((l) => ({
    ...l,
    webinarOpenedAt: l.webinarOpenedAt ? l.webinarOpenedAt.toISOString() : null,
    createdAt: l.createdAt.toISOString(),
  }));

  return (
    <AssistantPoolClient
      initialLeads={serializedLeads}
      leaderName={leader?.fullName || "Luis Andrés Salazar"}
      defaultWhatsappTemplate={defaultTemplate}
      followupWhatsappTemplate={followupTemplate}
    />
  );
}

