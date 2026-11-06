"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  PlayCircle,
  CheckCircle2,
  CalendarCheck,
  Sparkles,
  MessageCircle,
  Award,
} from "lucide-react";

interface WebinarPlayerProps {
  leadId?: string;
  candidateName: string;
  initialWatchPct: number;
  initialRequestedHr: boolean;
  videoUrl: string;
  webinarTitle: string;
  leaderName: string;
  leaderWhatsapp: string;
}

export default function WebinarPlayer({
  leadId,
  candidateName,
  initialWatchPct,
  initialRequestedHr,
  videoUrl,
  webinarTitle,
  leaderName,
  leaderWhatsapp,
}: WebinarPlayerProps) {
  const [watchPct, setWatchPct] = useState<number>(initialWatchPct || 0);
  const [requestedHr, setRequestedHr] = useState<boolean>(initialRequestedHr);
  const [submittingHr, setSubmittingHr] = useState(false);
  const reportedMilestones = useRef<Set<number>>(new Set([initialWatchPct]));

  // Registrar apertura inmediata del enlace al cargar la página
  useEffect(() => {
    if (leadId) {
      fetch("/api/webinar-tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          watchPct: Math.max(watchPct, 10),
        }),
      }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId]);

  async function reportMilestone(pct: number) {
    if (pct > watchPct) {
      setWatchPct(pct);
    }
    if (!leadId || reportedMilestones.current.has(pct)) return;
    reportedMilestones.current.add(pct);

    try {
      await fetch("/api/webinar-tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          watchPct: pct,
        }),
      });
    } catch {
      // ignore network error
    }
  }

  function handleVideoTimeUpdate(e: React.SyntheticEvent<HTMLVideoElement>) {
    const video = e.currentTarget;
    if (!video.duration) return;
    const currentRatio = (video.currentTime / video.duration) * 100;

    if (currentRatio >= 95 && !reportedMilestones.current.has(100)) {
      reportMilestone(100);
    } else if (currentRatio >= 80 && !reportedMilestones.current.has(80)) {
      reportMilestone(80);
    } else if (currentRatio >= 50 && !reportedMilestones.current.has(50)) {
      reportMilestone(50);
    } else if (currentRatio >= 25 && !reportedMilestones.current.has(25)) {
      reportMilestone(25);
    }
  }

  async function handleRequestHrInterview() {
    setSubmittingHr(true);
    try {
      if (leadId) {
        await fetch("/api/webinar-tracking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leadId,
            watchPct: Math.max(watchPct, 100),
            requestHrInterview: true,
          }),
        });
      }
      setWatchPct(100);
      setRequestedHr(true);
    } finally {
      setSubmittingHr(false);
    }
  }

  const isDirectMp4 = videoUrl.endsWith(".mp4");

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Encabezado Personalizado */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Portal Oficial de Selección — {leaderName}
          </span>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            Progreso registrado en sistema: {watchPct}%
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold">
          Hola {candidateName}, bienvenido(a) a la {webinarTitle}
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          Mira este video completo con atención. Nuestro sistema actualiza automáticamente tu progreso en la bandeja de{" "}
          <strong className="text-white">Recursos Humanos</strong> para habilitar tu entrevista de selección.
        </p>
      </div>

      {/* Contenedor del Video */}
      <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        {isDirectMp4 ? (
          <video
            src={videoUrl}
            controls
            onTimeUpdate={handleVideoTimeUpdate}
            onEnded={() => reportMilestone(100)}
            className="w-full aspect-video bg-black"
          />
        ) : (
          <div className="aspect-video w-full">
            <iframe
              src={videoUrl}
              title={webinarTitle}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Barra de telemetría rápida y simulación para pruebas */}
        <div className="p-4 sm:px-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <PlayCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Estado de visualización sincronizado con tu expediente:{" "}
              <strong className="text-amber-400">{watchPct}% completado</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Marcar avance:</span>
            {[25, 50, 80, 100].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => reportMilestone(pct)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  watchPct >= pct
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTA de Paso a Recursos Humanos */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl text-center space-y-5">
        {requestedHr ? (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              ¡Excelente, {candidateName}! Tu expediente ya pasó a Recursos Humanos
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Hemos notificado automáticamente al departamento de RRHH de{" "}
              <strong>{leaderName} (Carta Business Group)</strong> que completaste el Webinar y estás listo(a) para tu entrevista de selección y enrolamiento en licencia estatal.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${leaderWhatsapp}?text=${encodeURIComponent(
                  `¡Hola equipo de ${leaderName}! Soy ${candidateName}, acabo de terminar de ver el Webinar de Presentación Oficial al 100% y solicité mi entrevista con Recursos Humanos.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-7 rounded-2xl text-sm shadow-lg transition"
              >
                <MessageCircle className="w-5 h-5" />
                Confirmar mi Horario de Entrevista por WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-600">
              <Award className="w-4 h-4" />
              Siguiente Paso del Proceso de Selección
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              ¿Terminaste de ver la presentación y estás listo(a) para formarte como Agente?
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Al presionar el botón inferior, tu perfil pasará inmediatamente a la bandeja de{" "}
              <strong>Entrevista con Recursos Humanos</strong> para evaluar tu ingreso y el inicio de tu curso de licencia estatal.
            </p>
            <button
              type="button"
              onClick={handleRequestHrInterview}
              disabled={submittingHr}
              className="inline-flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-4 px-8 rounded-2xl text-base shadow-xl transition"
            >
              <CalendarCheck className="w-5 h-5" />
              {submittingHr
                ? "Actualizando tu expediente..."
                : "¡Ya vi el Webinar! Quiero mi Entrevista con RRHH"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

