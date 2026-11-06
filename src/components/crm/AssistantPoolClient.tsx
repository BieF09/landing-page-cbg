"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { buildWhatsappLink } from "@/lib/whatsapp";
import {
  PhoneCall,
  MessageCircle,
  PlayCircle,
  ArrowRightCircle,
  Clock,
  CheckCircle2,
  MapPin,
  Share2,
  FileText,
  ExternalLink,
} from "lucide-react";

interface LeadItem {
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
  callAttempts: number;
  webinarOpenedAt: string | null;
  webinarWatchPct: number;
  requestedHrInterview: boolean;
  notes: string | null;
  createdAt: string;
  campaign?: {
    name: string;
    platform: string;
  } | null;
}

interface AssistantPoolClientProps {
  initialLeads: LeadItem[];
  leaderName: string;
  defaultWhatsappTemplate: string;
  followupWhatsappTemplate: string;
}

export default function AssistantPoolClient({
  initialLeads,
  leaderName,
  defaultWhatsappTemplate,
  followupWhatsappTemplate,
}: AssistantPoolClientProps) {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [activeTab, setActiveTab] = useState<"POOL" | "CONTACTED_WEBINAR_SENT">(
    "POOL"
  );
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  const poolLeads = leads.filter((l) => l.stage === "POOL");
  const webinarLeads = leads.filter(
    (l) => l.stage === "CONTACTED_WEBINAR_SENT" || l.stage === "WEBINAR_WATCHED"
  );

  const displayedLeads = activeTab === "POOL" ? poolLeads : webinarLeads;

  async function updateLead(
    leadId: string,
    payload: Record<string, unknown>
  ) {
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

  function handleSendWebinarWhatsapp(lead: LeadItem, isFollowup = false) {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";
    const webinarLink = `${origin}/webinar?lead=${lead.id}`;

    const waUrl = buildWhatsappLink(
      lead.phone,
      isFollowup ? followupWhatsappTemplate : defaultWhatsappTemplate,
      {
        nombre: lead.firstName,
        lider: leaderName,
        estado: lead.state,
        link_webinar: webinarLink,
      }
    );

    window.open(waUrl, "_blank");

    updateLead(lead.id, {
      stage: "CONTACTED_WEBINAR_SENT",
      incrementCallAttempt: isFollowup,
      activityType: "WHATSAPP_SENT",
      activityDescription: `Asistente envió acceso único al Webinar por WhatsApp (${webinarLink}).`,
    });
  }

  return (
    <div className="space-y-6">
      {/* Cabecera Operativa de la Asistente */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-sky-400">
            Módulo Operativo 1 — Asistente Ejecutiva
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            La Piscina de Nuevos Candidatos & Envío de Webinar
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Aquí solo entran candidatos <strong>pre-calificados con SSN o ITIN</strong>. Llama al candidato, envíale su link único de Webinar a 1 clic y verifica quién ya vio el video para pasarlo a Recursos Humanos.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-center">
            <span className="block text-2xl font-black text-amber-400">
              {poolLeads.length}
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">
              En Piscina (Nuevos)
            </span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-center">
            <span className="block text-2xl font-black text-sky-400">
              {webinarLeads.length}
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">
              Viendo Webinar
            </span>
          </div>
        </div>
      </div>

      {/* Selector de Bandeja (Mobile & Desktop) */}
      <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab("POOL")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
            activeTab === "POOL"
              ? "bg-slate-900 text-amber-400 shadow"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          1. En Piscina — Por Contactar ({poolLeads.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("CONTACTED_WEBINAR_SENT")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
            activeTab === "CONTACTED_WEBINAR_SENT"
              ? "bg-slate-900 text-sky-400 shadow"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <PlayCircle className="w-4 h-4" />
          2. Contactados / Seguimiento de Webinar ({webinarLeads.length})
        </button>
      </div>

      {/* Lista de Tarjetas Operativas */}
      {displayedLeads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-900 text-lg">
            ¡Bandeja al día! No hay candidatos pendientes en esta pestaña
          </h3>
          <p className="text-xs text-slate-500">
            Los nuevos registros calificados desde la Landing Page aparecerán aquí inmediatamente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {displayedLeads.map((lead) => {
            const isHighSsn = lead.qualification === "QUALIFIED_HIGH";
            return (
              <div
                key={lead.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-5 sm:p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  {/* Badges superiores */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                        isHighSsn
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {isHighSsn
                        ? "🟢 SSN + Permiso (Prioridad Alta)"
                        : "🟡 Calificado por ITIN"}
                    </span>

                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Intentos de llamada: <strong>{lead.callAttempts}</strong>
                    </span>
                  </div>

                  {/* Nombre y Ubicación */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        {lead.firstName} {lead.lastName}
                      </h3>
                      <p className="text-xs text-slate-600 flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          {lead.city ? `${lead.city}, ` : ""}
                          {lead.state}
                        </span>
                        <span>•</span>
                        <span className="font-mono font-semibold text-slate-800">
                          +{lead.phone}
                        </span>
                      </p>
                    </div>

                    {lead.campaign && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                        <Share2 className="w-3 h-3 text-amber-600" />
                        {lead.campaign.platform}: {lead.campaign.name}
                      </span>
                    )}
                  </div>

                  {/* Indicador en vivo del Webinar */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlayCircle
                        className={`w-5 h-5 ${
                          lead.webinarWatchPct >= 80
                            ? "text-emerald-600"
                            : lead.webinarWatchPct > 0
                            ? "text-amber-500"
                            : "text-slate-400"
                        }`}
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          Estado del Webinar Grabado:{" "}
                          <span className="text-amber-600">
                            {lead.webinarWatchPct}% visto
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {lead.webinarOpenedAt
                            ? "Ya abrió el enlace personalizado"
                            : "Aún no ha abierto el enlace del Webinar"}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`/webinar?lead=${lead.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-slate-700 hover:text-amber-600 inline-flex items-center gap-1"
                    >
                      <span>Link Webinar</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Notas rápidas */}
                  <div className="space-y-1.5">
                    <div className="text-xs text-slate-600 bg-amber-50/60 border border-amber-200/70 rounded-xl p-2.5">
                      <strong className="text-slate-900">Nota actual:</strong>{" "}
                      {lead.notes || "Sin notas registradas."}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Escribir nota de la llamada..."
                        value={noteDrafts[lead.id] ?? ""}
                        onChange={(e) =>
                          setNoteDrafts((prev) => ({
                            ...prev,
                            [lead.id]: e.target.value,
                          }))
                        }
                        className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        disabled={busyId === lead.id || !noteDrafts[lead.id]}
                        onClick={() => {
                          updateLead(lead.id, {
                            notes: noteDrafts[lead.id],
                            activityType: "CALL_ATTEMPT",
                            activityDescription: `Asistente actualizó nota: "${noteDrafts[lead.id]}"`,
                          });
                          setNoteDrafts((prev) => ({ ...prev, [lead.id]: "" }));
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Guardar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Botonera Táctil de 1 Clic para Celular y PC */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <a
                    href={`tel:+${lead.phone}`}
                    onClick={() =>
                      updateLead(lead.id, {
                        incrementCallAttempt: true,
                        activityType: "CALL_ATTEMPT",
                        activityDescription: `Asistente realizó llamada telefónica a ${lead.firstName}.`,
                      })
                    }
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <PhoneCall className="w-4 h-4 text-amber-400" />
                    1. Llamar Ahora
                  </a>

                  <button
                    type="button"
                    onClick={() => handleSendWebinarWhatsapp(lead, false)}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <MessageCircle className="w-4 h-4" />
                    2. WhatsApp + Webinar
                  </button>

                  <button
                    type="button"
                    disabled={busyId === lead.id}
                    onClick={() =>
                      updateLead(lead.id, {
                        stage: "READY_FOR_HR",
                        activityType: "STAGE_CHANGE",
                        activityDescription:
                          "Asistente aprobó primer filtro y envió al candidato a Entrevista con Recursos Humanos.",
                      })
                    }
                    className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <ArrowRightCircle className="w-4 h-4" />
                    3. Pasar a RRHH
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

