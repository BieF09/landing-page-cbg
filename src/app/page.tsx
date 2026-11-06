import React from "react";
import { prisma } from "@/lib/prisma";
import LandingExperience from "@/components/landing/LandingExperience";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { src?: string; mode?: string };
}) {
  const leader = await prisma.leaderProfile.findFirst();

  const fallbackLeader = leader || {
    fullName: "Luis Andrés Salazar",
    title: "Líder de Agencia & Formación Empresarial",
    agencyName: "Carta Business Group | Globe Life (AIL)",
    whatsappNumber: "17865550199",
    bio: "Formando a la próxima generación de líderes y empresarios hispanos en la industria financiera y de seguros en Estados Unidos.",
    heroHeadline:
      "Desarrolla una Carrera Empresarial 100% Remota en el Sector Financiero de EE. UU.",
  };

  const initialMode =
    searchParams?.mode === "proteccion" ? "CLIENT" : "RECRUITMENT";

  return (
    <LandingExperience
      leader={fallbackLeader}
      initialMode={initialMode}
      campaignCode={searchParams?.src}
    />
  );
}

