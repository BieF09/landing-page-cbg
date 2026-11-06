import React from "react";
import { prisma } from "@/lib/prisma";
import LandingExperience from "@/components/landing/LandingExperience";

export const dynamic = "force-dynamic";

export default async function ProteccionPage({
  searchParams,
}: {
  searchParams?: { src?: string };
}) {
  const leader = await prisma.leaderProfile.findFirst();

  const fallbackLeader = leader || {
    fullName: "Luis Andrés Salazar",
    title: "Líder de Agencia & Formación Empresarial",
    agencyName: "Carta Business Group | Globe Life (AIL)",
    whatsappNumber: "17865550199",
    bio: "Protege el patrimonio y el futuro de tu familia en Estados Unidos con el respaldo de más de 70 años de American Income Life / Globe Life.",
    heroHeadline:
      "Protección Financiera y Seguro de Vida para Familias Hispanas en EE. UU.",
  };

  return (
    <LandingExperience
      leader={fallbackLeader}
      initialMode="CLIENT"
      campaignCode={searchParams?.src}
    />
  );
}

