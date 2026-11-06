import React from "react";
import { prisma } from "@/lib/prisma";
import ClientLeadsManager from "@/components/crm/ClientLeadsManager";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const clientLeads = await prisma.lead.findMany({
    where: {
      leadType: "CLIENT",
    },
    include: {
      assignedAgent: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const teamAgents = await prisma.user.findMany({
    where: {
      role: {
        in: ["LEADER", "AGENT"],
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const serializedLeads = clientLeads.map((l) => ({
    id: l.id,
    firstName: l.firstName,
    lastName: l.lastName,
    phone: l.phone,
    state: l.state,
    city: l.city,
    stage: l.stage,
    notes: l.notes,
    assignedAgentId: l.assignedAgentId,
    assignedAgent: l.assignedAgent
      ? {
          id: l.assignedAgent.id,
          name: l.assignedAgent.name,
          phone: l.assignedAgent.phone,
        }
      : null,
    quizAnswers:
      (l.quizAnswers as {
        familyGroup?: string;
        coverageInterest?: string;
      } | null) || null,
  }));

  const serializedAgents = teamAgents.map((a) => ({
    id: a.id,
    name: a.name,
    phone: a.phone,
  }));

  return (
    <ClientLeadsManager
      initialLeads={serializedLeads}
      teamAgents={serializedAgents}
    />
  );
}

