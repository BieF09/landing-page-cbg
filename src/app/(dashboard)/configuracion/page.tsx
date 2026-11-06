import React from "react";
import { prisma } from "@/lib/prisma";
import SettingsManagerClient from "@/components/crm/SettingsManagerClient";

export const dynamic = "force-dynamic";

export default async function ConfiguracionPage() {
  const leader = await prisma.leaderProfile.findFirst();
  const itinRules = await prisma.itinJurisdiction.findMany({
    orderBy: { stateCode: "asc" },
  });
  const templates = await prisma.whatsappTemplate.findMany({
    orderBy: { createdAt: "asc" },
  });

  if (!leader) {
    return <div>Perfil de líder no encontrado. Ejecuta el seed primero.</div>;
  }

  return (
    <SettingsManagerClient
      initialLeader={{
        id: leader.id,
        fullName: leader.fullName,
        title: leader.title,
        agencyName: leader.agencyName,
        whatsappNumber: leader.whatsappNumber,
        webinarVideoUrl: leader.webinarVideoUrl,
        webinarTitle: leader.webinarTitle,
        heroHeadline: leader.heroHeadline,
      }}
      initialItinRules={itinRules}
      initialTemplates={templates}
    />
  );
}

