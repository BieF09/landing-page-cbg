import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  PhoneCall,
  PlayCircle,
  UserCheck,
  GraduationCap,
  HeartHandshake,
  Share2,
  ShieldAlert,
  ArrowRight,
  Activity,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LeaderDashboardPage() {
  const allLeads = await prisma.lead.findMany({
    include: {
      campaign: true,
      assignedAgent: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const recentActivities = await prisma.leadActivity.findMany({
    include: {
      lead: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  const recruitmentLeads = allLeads.filter((l) => l.leadType === "RECRUITMENT");
  const clientLeads = allLeads.filter((l) => l.leadType === "CLIENT");

  const qualifiedLeads = recruitmentLeads.filter(
    (l) => l.qualification !== "DISQUALIFIED_DOCS"
  );
  const disqualifiedLeads = recruitmentLeads.filter(
    (l) => l.qualification === "DISQUALIFIED_DOCS"
  );

  // Contadores de progreso acumulado en el embudo
  const totalInPoolOrBeyond = qualifiedLeads.length;
  const contactedOrBeyond = qualifiedLeads.filter(
    (l) => l.stage !== "POOL" && l.stage !== "DISCARDED"
  ).length;
  const watchedWebinarOrBeyond = qualifiedLeads.filter(
    (l) =>
      l.webinarWatchPct >= 50 ||
      ["WEBINAR_WATCHED", "READY_FOR_HR", "HR_INTERVIEWED", "ENROLLED_LICENSING", "ACTIVE_AGENT"].includes(
        l.stage
      )
  ).length;
  const readyForHrOrBeyond = qualifiedLeads.filter((l) =>
    ["READY_FOR_HR", "HR_INTERVIEWED", "ENROLLED_LICENSING", "ACTIVE_AGENT"].includes(
      l.stage
    )
  ).length;
  const enrolledOrActive = qualifiedLeads.filter((l) =>
    ["ENROLLED_LICENSING", "ACTIVE_AGENT"].includes(l.stage)
  ).length;

  const pctContact =
    totalInPoolOrBeyond > 0
      ? Math.round((contactedOrBeyond / totalInPoolOrBeyond) * 100)
      : 0;
  const pctWebinar =
    totalInPoolOrBeyond > 0
      ? Math.round((watchedWebinarOrBeyond / totalInPoolOrBeyond) * 100)
      : 0;
  const pctHr =
    totalInPoolOrBeyond > 0
      ? Math.round((readyForHrOrBeyond / totalInPoolOrBeyond) * 100)
      : 0;
  const pctClose =
    totalInPoolOrBeyond > 0
      ? Math.round((enrolledOrActive / totalInPoolOrBeyond) * 100)
      : 0;

  const kanbanColumns = [
    {
      title: "1. En Piscina (Asistente)",
      stageList: ["POOL"],
      color: "border-amber-400",
      badge: "bg-amber-100 text-amber-800",
    },
    {
      title: "2. Webinar Enviado",
      stageList: ["CONTACTED_WEBINAR_SENT", "WEBINAR_WATCHED"],
      color: "border-sky-400",
      badge: "bg-sky-100 text-sky-800",
    },
    {
      title: "3. Entrevista RRHH",
      stageList: ["READY_FOR_HR", "HR_INTERVIEWED"],
      color: "border-purple-400",
      badge: "bg-purple-100 text-purple-800",
    },
    {
      title: "4. Enrolado en Licencia",
      stageList: ["ENROLLED_LICENSING", "ACTIVE_AGENT"],
      color: "border-emerald-500",
      badge: "bg-emerald-100 text-emerald-800",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Banner Ejecutivo de Luis Andrés Salazar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-400 bg-amber-500/15 px-3 py-1 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" />
            Centro de Mando 360° — Superusuario Líder
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Panel Ejecutivo de Reclutamiento, Conversión y Clientes
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Supervisa en tiempo real el trabajo de tu Asistente en La Piscina, las entrevistas de Recursos Humanos, el porcentaje de cierre a Licencia Estatal y el rendimiento de tus campañas en Instagram y TikTok.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/campanas"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm px-4 py-3 rounded-xl shadow transition"
          >
            <Share2 className="w-4 h-4" />
            Crear Link para Redes Sociales
          </Link>
          <Link
            href="/clientes"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-700 transition"
          >
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            Asignar Clientes al Equipo ({clientLeads.length})
          </Link>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Candidatos Calificados</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {totalInPoolOrBeyond}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Con SSN o ITIN válido
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Tasa Contacto Asistente</span>
            <PhoneCall className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {pctContact}%
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {contactedOrBeyond} de {totalInPoolOrBeyond} gestionados
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Conversión Webinar</span>
            <PlayCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {pctWebinar}%
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {watchedWebinarOrBeyond} vieron la presentación
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Cierre a Licencia Estatal</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-600 mt-2">
            {pctClose}%
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {enrolledOrActive} enrolados en Pre-Licensing
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Tiempo Ahorrado (Filtro)</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {disqualifiedLeads.length}
          </p>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">
            Filtrados sin SSN/ITIN automáticamente
          </p>
        </div>
      </div>

      {/* EMBUDO VISUAL DE CONVERSIÓN PASO A PASO */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Embudo Operativo de Reclutamiento (Piscina ➔ Asistente ➔ Webinar ➔ RRHH ➔ Licencia)
            </h2>
            <p className="text-xs text-slate-500">
              Porcentaje real de avance en cada eslabón del sistema de Luis Andrés Salazar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: "Etapa 1: La Piscina",
              count: totalInPoolOrBeyond,
              pct: 100,
              role: "Filtro Automático Quiz",
              href: "/piscina",
              barColor: "bg-amber-500",
            },
            {
              step: "Etapa 2: Primer Contacto & Webinar",
              count: contactedOrBeyond,
              pct: pctContact,
              role: "Gestión de Asistente",
              href: "/piscina",
              barColor: "bg-sky-500",
            },
            {
              step: "Etapa 3: Entrevista Selección",
              count: readyForHrOrBeyond,
              pct: pctHr,
              role: "Gestión de RRHH",
              href: "/rrhh",
              barColor: "bg-purple-500",
            },
            {
              step: "Etapa 4: Enrolado en Licencia",
              count: enrolledOrActive,
              pct: pctClose,
              role: "Nuevo Agente en Formación",
              href: "/rrhh",
              barColor: "bg-emerald-500",
            },
          ].map((stage) => (
            <Link
              key={stage.step}
              href={stage.href}
              className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl p-4 space-y-3 transition"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">{stage.role}</span>
                <span className="font-extrabold text-slate-900 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                  {stage.pct}%
                </span>
              </div>
              <div className="font-extrabold text-sm text-slate-900">
                {stage.step}
              </div>
              <div className="text-2xl font-black text-slate-900">
                {stage.count}{" "}
                <span className="text-xs font-normal text-slate-500">
                  candidatos
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`${stage.barColor} h-2 rounded-full`}
                  style={{ width: `${Math.max(stage.pct, 8)}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* TABLERO KANBAN EJECUTIVO + BITÁCORA EN VIVO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">
              Vista Kanban en Vivo del Pipeline de Reclutamiento
            </h2>
            <div className="flex gap-2">
              <Link
                href="/piscina"
                className="text-xs font-bold text-amber-600 hover:underline inline-flex items-center gap-1"
              >
                Ir a Piscina <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/rrhh"
                className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-1"
              >
                Ir a RRHH <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {kanbanColumns.map((col) => {
              const items = qualifiedLeads.filter((l) =>
                col.stageList.includes(l.stage)
              );
              return (
                <div
                  key={col.title}
                  className={`bg-white rounded-2xl border-t-4 ${col.color} border border-slate-200 p-3.5 space-y-3 shadow-sm`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-slate-900">
                      {col.title}
                    </h3>
                    <span
                      className={`text-[11px] font-black px-2 py-0.5 rounded-full ${col.badge}`}
                    >
                      {items.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {items.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">
                            {lead.firstName} {lead.lastName}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                            {lead.state}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center justify-between">
                          <span>
                            {lead.documentStatus === "SSN_WORK_PERMIT"
                              ? "🟢 SSN"
                              : "🟡 ITIN"}
                          </span>
                          <span>Webinar: {lead.webinarWatchPct}%</span>
                        </div>
                        {lead.campaign && (
                          <div className="text-[10px] font-semibold text-amber-700 truncate">
                            📱 {lead.campaign.name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bitácora en Tiempo Real */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-600" />
            Actividad Reciente del Equipo
          </h2>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="border-b border-slate-100 last:border-none pb-3 last:pb-0 space-y-1"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold text-slate-700">
                    {act.lead.firstName} {act.lead.lastName}
                  </span>
                  <span>{act.actionType}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {act.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

