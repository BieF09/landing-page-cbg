import React from "react";
import { prisma } from "@/lib/prisma";
import CampaignManagerClient from "@/components/analytics/CampaignManagerClient";

export const dynamic = "force-dynamic";

export default async function CampanasPage() {
  const campaigns = await prisma.campaign.findMany({
    include: {
      leads: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatted = campaigns.map((c) => {
    const totalLeads = c.leads.length;
    const qualifiedLeads = c.leads.filter(
      (l) => l.qualification !== "DISQUALIFIED_DOCS"
    ).length;
    const webinarWatched = c.leads.filter(
      (l) => l.webinarWatchPct >= 50
    ).length;
    const enrolledLicensing = c.leads.filter(
      (l) =>
        l.stage === "ENROLLED_LICENSING" ||
        l.stage === "ACTIVE_AGENT" ||
        l.stage === "CLIENT_CLOSED"
    ).length;

    return {
      id: c.id,
      code: c.code,
      name: c.name,
      platform: c.platform,
      targetFunnel: c.targetFunnel,
      clicksCount: c.clicksCount,
      totalLeads,
      qualifiedLeads,
      webinarWatched,
      enrolledLicensing,
    };
  });

  return <CampaignManagerClient initialCampaigns={formatted} />;
}

