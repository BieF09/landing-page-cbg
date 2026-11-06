"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HeartHandshake,
  UserPlus,
  MessageCircle,
  CheckCircle2,
  MapPin,
  ShieldCheck,
} from "lucide-react";

interface AgentUser {
  id: string;
  name: string;
  phone: string | null;
}

interface ClientLead {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  state: string;
  city: string | null;
  stage: string;
  notes: string | null;
  assignedAgentId: string | null;
  assignedAgent?: AgentUser | null;
  quizAnswers?: {
    familyGroup?: string;
    coverageInterest?: string;
  } | null;
}

export default function ClientLeadsManager({
  initialLeads,
  teamAgents,
}: {
  initialLeads: ClientLead[];
  teamAgents: AgentUser[];
}) {
  const router = useRouter();
  const [leads, setLeads] = useState<ClientLead[]>(initialLeads);
  const [selectedAgents, setSelectedAgents] = useState<Record<string, string>>(
    {}
  );
  const [busyId, setBusyId] = useState<string | null>(null);

  async function assignToAgent(lead: ClientLead) {
    const agentId =
      selectedAgents[lead.id] || lead.assignedAgentId || teamAgents[0]?.id;
    const agent = teamAgents.find((a) => a.id === agentId);
    if (!agent) return;

    setBusyId(lead.id);
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: "CLIENT_ASSIGNED",
          assignedAgentId: agent.id,
          activityType: "ASSIGNED_TO_AGENT",
          activityDescription: `Luis Andrés asignó este cliente de póliza al agente ${agent.name}.`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.lead) {
        setLeads((prev) =>
          prev.map((item) => (item.id === lead.id ? { ...item, ...data.lead } : item))
        );
        router.refresh();

        if (agent.phone) {
          const msg = `¡Hola ${agent.name}! 🛡️ Te acabo de asignar un nuevo Lead de Protección Familiar desde nuestro sistema:\n\n*Cliente:* ${lead.firstName} ${lead.lastName}\n*Teléfono:* +${lead.phone}\n*Estado:* ${lead.state}\n*Interés:* ${
            lead.quizAnswers?.coverageInterest || "Seguro de Vida"
          }\n\nPor favor contáctalo hoy mismo y actualiza el cierre en el panel.`;
          window.open(
            `https://wa.me/${agent.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
              msg
            )}`,
            "_blank"
          );
        }
      }
    } finally {
      setBusyId(null);
    }
  }

  async function markPolicyClosed(lead: ClientLead) {
    setBusyId(lead.id);
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: "CLIENT_CLOSED",
          activityType: "STAGE_CHANGE",
          activityDescription: `¡Póliza emitida y cerrada con éxito para ${lead.firstName} ${lead.lastName}!`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.lead) {
        setLeads((prev) =>
          prev.map((item) => (item.id === lead.id ? { ...item, ...data.lead } : item))
        );
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
          Embudo Secundario — Protección Familiar & Distribución al Equipo
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold">
          Clientes de Pólizas & Asignación a Miembros del Equipo
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
          Atiende directamente las solicitudes de Seguros de Vida / Beneficios Familiares o asígnalas con 1 clic por WhatsApp a los agentes licenciados de tu equipo para impulsar su retención y tus overrides.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                    lead.stage === "CLIENT_CLOSED"
                      ? "bg-emerald-100 text-emerald-800"
                      : lead.stage === "CLIENT_ASSIGNED"
                      ? "bg-sky-100 text-sky-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {lead.stage === "CLIENT_CLOSED"
                    ? "✅ Póliza Emitida / Cerrada"
                    : lead.stage === "CLIENT_ASSIGNED"
                    ? `Asignado a: ${lead.assignedAgent?.name || "Agente"}`
                    : "🛡️ Nuevo Cliente Potencial"}
                </span>

                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  {lead.city ? `${lead.city}, ` : ""}
                  {lead.state}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {lead.firstName} {lead.lastName}
                </h3>
                <p className="text-xs font-mono text-slate-600 mt-0.5">
                  Tel / WhatsApp: +{lead.phone}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1">
                <p>
                  <strong className="text-slate-900">Grupo Familiar:</strong>{" "}
                  {lead.quizAnswers?.familyGroup || "No especificado"}
                </p>
                <p>
                  <strong className="text-slate-900">Cobertura Solicitada:</strong>{" "}
                  {lead.quizAnswers?.coverageInterest || "Protección Familiar"}
                </p>
              </div>

              {/* Selector de Agente del Equipo */}
              <div className="pt-1">
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">
                  Delegar / Asignar este Lead a un Agente de tu Equipo:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={
                      selectedAgents[lead.id] ||
                      lead.assignedAgentId ||
                      teamAgents[0]?.id ||
                      ""
                    }
                    onChange={(e) =>
                      setSelectedAgents((prev) => ({
                        ...prev,
                        [lead.id]: e.target.value,
                      }))
                    }
                    className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold"
                  >
                    {teamAgents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    disabled={busyId === lead.id}
                    onClick={() => assignToAgent(lead)}
                    className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs transition"
                  >
                    <UserPlus className="w-4 h-4" />
                    Asignar y Enviar por WhatsApp
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${lead.phone.replace(
                  /\D/g,
                  ""
                )}?text=${encodeURIComponent(
                  `¡Hola ${lead.firstName}! Te saluda el equipo de Luis Andrés Salazar en Carta Business Group / Globe Life respecto a tu solicitud de información sobre ${
                    lead.quizAnswers?.coverageInterest || "Protección Familiar"
                  }.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <MessageCircle className="w-4 h-4" />
                Contactar Cliente Directo
              </a>

              {lead.stage !== "CLIENT_CLOSED" && (
                <button
                  type="button"
                  disabled={busyId === lead.id}
                  onClick={() => markPolicyClosed(lead)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Marcar Póliza Emitida
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

