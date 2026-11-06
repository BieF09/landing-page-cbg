"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { buildWhatsappLink } from "@/lib/whatsapp";
import {
  UserCheck,
  GraduationCap,
  Award,
  MessageCircle,
  CheckSquare,
  PlayCircle,
  MapPin,
  PhoneCall,
} from "lucide-react";

interface HrLeadItem {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  state: string;
  city: string | null;
  documentStatus: string;
  qualification: string;
  stage: string;
  webinarWatchPct: number;
  requestedHrInterview: boolean;
  hrChecklist: {
    understands1099?: boolean;
    fullTimeCommitment?: boolean;
    licenseFeeReady?: boolean;
  } | null;
  notes: string | null;
}

interface HrPipelineClientProps {
  initialLeads: HrLeadItem[];
  leaderName: string;
  hrInterviewTemplate: string;
  enrolledTemplate: string;
}

export default function HrPipelineClient({
  initialLeads,
  leaderName,
  hrInterviewTemplate,
  enrolledTemplate,
}: HrPipelineClientProps) {
  const router = useRouter();
  const [leads, setLeads] = useState<HrLeadItem[]>(initialLeads);
  const [activeStage, setActiveStage] = useState<
    "READY_FOR_HR" | "ENROLLED_LICENSING" | "ACTIVE_AGENT"
  >("READY_FOR_HR");
  const [busyId, setBusyId] = useState<string | null>(null);

  const readyLeads = leads.filter(
    (l) => l.stage === "READY_FOR_HR" || l.stage === "HR_INTERVIEWED"
  );
  const enrolledLeads = leads.filter((l) => l.stage === "ENROLLED_LICENSING");
  const activeAgents = leads.filter((l) => l.stage === "ACTIVE_AGENT");

  const displayed =
    activeStage === "READY_FOR_HR"
      ? readyLeads
      : activeStage === "ENROLLED_LICENSING"
      ? enrolledLeads
      : activeAgents;

  async function updateLead(leadId: string, payload: Record<string, unknown>) {
    setBusyId(leadId);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.lead) {
        setLeads((prev) =>
          prev.map((item) => (item.id === leadId ? { ...item, ...data.lead } : item))
        );
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  function toggleChecklist(
    lead: HrLeadItem,
    field: "understands1099" | "fullTimeCommitment" | "licenseFeeReady"
  ) {
    const current = lead.hrChecklist || {};
    const updatedChecklist = {
      ...current,
      [field]: !current[field],
    };
    updateLead(lead.id, {
      hrChecklist: updatedChecklist,
      activityType: "HR_NOTE",
      activityDescription: `RRHH actualizó checklist de entrevista de ${lead.firstName}.`,
    });
  }

  return (
    <div className="space-y-6">
      {/* Cabecera de Recursos Humanos */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
            Módulo Operativo 2 — Departamento de Recursos Humanos
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Entrevistas de Selección & Enrolamiento a Licencia Estatal
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Bandeja limpia con los candidatos que ya superaron el filtro de la Asistente y vieron el Webinar. Realiza la entrevista, valida el checklist y enrólalos en el curso de licencia de corredor de seguros.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-center">
            <span className="block text-2xl font-black text-amber-400">
              {readyLeads.length}
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">
              Por Entrevistar
            </span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-center">
            <span className="block text-2xl font-black text-emerald-400">
              {enrolledLeads.length}
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">
              En Licencia
            </span>
          </div>
        </div>
      </div>

      {/* Pestañas de Etapa RRHH */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveStage("READY_FOR_HR")}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
            activeStage === "READY_FOR_HR"
              ? "bg-slate-900 text-amber-400 shadow"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          1. Listos para Entrevista ({readyLeads.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveStage("ENROLLED_LICENSING")}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
            activeStage === "ENROLLED_LICENSING"
              ? "bg-slate-900 text-emerald-400 shadow"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          2. Enrolados en Licencia ({enrolledLeads.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveStage("ACTIVE_AGENT")}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
            activeStage === "ACTIVE_AGENT"
              ? "bg-slate-900 text-sky-400 shadow"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Award className="w-4 h-4" />
          3. Agentes Licenciados Activos ({activeAgents.length})
        </button>
      </div>

      {/* Tarjetas de Evaluación de RRHH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {displayed.map((lead) => {
          const checklist = lead.hrChecklist || {};
          return (
            <div
              key={lead.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    {lead.documentStatus === "SSN_WORK_PERMIT"
                      ? "🟢 Documentación: SSN + Permiso"
                      : "🟡 Documentación: ITIN"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    <PlayCircle className="w-3.5 h-3.5" />
                    Webinar visto: {lead.webinarWatchPct}%
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {lead.firstName} {lead.lastName}
                  </h3>
                  <p className="text-xs text-slate-600 flex items-center gap-2 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>
                      {lead.city ? `${lead.city}, ` : ""}
                      {lead.state}
                    </span>
                    <span>•</span>
                    <span className="font-mono font-bold">+{lead.phone}</span>
                  </p>
                </div>

                {/* Checklist Interactivo de Entrevista de RRHH */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                    Checklist de Entrevista de Recursos Humanos
                  </div>

                  {[
                    {
                      key: "understands1099" as const,
                      label: "Comprende y acepta esquema 1099 (100% Comisiones + Residuales)",
                    },
                    {
                      key: "fullTimeCommitment" as const,
                      label: "Disponibilidad confirmada para capacitación virtual y sistema CBG",
                    },
                    {
                      key: "licenseFeeReady" as const,
                      label: "Comprometido con inscripción a Pre-Licensing y examen estatal",
                    },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center gap-2.5 text-xs font-medium text-slate-800 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(checklist[item.key])}
                        onChange={() => toggleChecklist(lead, item.key)}
                        className="rounded accent-emerald-600 w-4 h-4"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>

                <div className="text-xs text-slate-600 bg-amber-50/50 border border-amber-200/60 rounded-xl p-3">
                  <strong>Notas del expediente:</strong> {lead.notes || "Sin notas."}
                </div>
              </div>

              {/* Acciones de RRHH */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <a
                  href={`tel:+${lead.phone}`}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  Llamar
                </a>

                <button
                  type="button"
                  onClick={() => {
                    const tpl =
                      lead.stage === "ENROLLED_LICENSING"
                        ? enrolledTemplate
                        : hrInterviewTemplate;
                    const url = buildWhatsappLink(lead.phone, tpl, {
                      nombre: lead.firstName,
                      lider: leaderName,
                      estado: lead.state,
                      link_webinar: "",
                    });
                    window.open(url, "_blank");
                  }}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp RRHH
                </button>

                {lead.stage !== "ENROLLED_LICENSING" &&
                lead.stage !== "ACTIVE_AGENT" ? (
                  <button
                    type="button"
                    disabled={busyId === lead.id}
                    onClick={() =>
                      updateLead(lead.id, {
                        stage: "ENROLLED_LICENSING",
                        activityType: "STAGE_CHANGE",
                        activityDescription: `🎓 RRHH aprobó la entrevista y enroló a ${lead.firstName} en el curso de Licencia Estatal.`,
                      })
                    }
                    className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Enrolar a Licencia
                  </button>
                ) : lead.stage === "ENROLLED_LICENSING" ? (
                  <button
                    type="button"
                    disabled={busyId === lead.id}
                    onClick={() =>
                      updateLead(lead.id, {
                        stage: "ACTIVE_AGENT",
                        activityType: "STAGE_CHANGE",
                        activityDescription: `🏆 ¡${lead.firstName} aprobó su examen estatal y es oficialmente Agente Activo del equipo!`,
                      })
                    }
                    className="py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <Award className="w-4 h-4" />
                    Graduar Agente Activo
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

