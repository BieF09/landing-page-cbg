"use client";

import React, { useState, useEffect } from "react";
import IncomeSimulator from "./IncomeSimulator";
import RecruitmentQuiz from "./RecruitmentQuiz";
import ProtectionQuiz from "./ProtectionQuiz";
import {
  ShieldCheck,
  Award,
  TrendingUp,
  Users,
  Globe2,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  HeartHandshake,
  Lock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface LandingExperienceProps {
  leader: {
    fullName: string;
    title: string;
    agencyName: string;
    whatsappNumber: string;
    bio: string | null;
    heroHeadline: string;
  };
  initialMode?: "RECRUITMENT" | "CLIENT";
  campaignCode?: string;
}

export default function LandingExperience({
  leader,
  initialMode = "RECRUITMENT",
  campaignCode,
}: LandingExperienceProps) {
  const [activeFunnel, setActiveFunnel] = useState<"RECRUITMENT" | "CLIENT">(
    initialMode
  );

  // Registrar clic de campaña si viene ?src=...
  useEffect(() => {
    if (campaignCode) {
      fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "INCREMENT_CLICK",
          code: campaignCode,
        }),
      }).catch(() => {});
    }
  }, [campaignCode]);

  const scrollToApply = (mode: "RECRUITMENT" | "CLIENT") => {
    setActiveFunnel(mode);
    const el = document.getElementById("aplicar-ahora");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navbar Corporativa */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center text-lg shadow">
              CBG
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-2">
                {leader.fullName}
                <span className="hidden md:inline-block text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  {leader.agencyName}
                </span>
              </div>
              <p className="text-xs text-slate-400">{leader.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => scrollToApply("CLIENT")}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-amber-400 px-3 py-2 rounded-lg transition"
            >
              <HeartHandshake className="w-4 h-4 text-amber-400" />
              Proteger a mi Familia
            </button>
            <button
              type="button"
              onClick={() => scrollToApply("RECRUITMENT")}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow transition"
            >
              Aplicar al Equipo
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-2 rounded-lg border border-slate-800 hover:border-slate-700"
              title="Acceso al Sistema Operativo (Líder, Asistente, RRHH)"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Portal Equipo</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION CON BIFURCADOR INTELIGENTE */}
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-14 md:py-20 overflow-hidden border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Respaldo Institucional: Carta Business Group & Globe Life (Desde 1951)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              {leader.heroHeadline}
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              {leader.bio}
            </p>

            {/* Bifurcador Principal (Carrera vs Protección Familiar) */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3.5">
              <button
                type="button"
                onClick={() => scrollToApply("RECRUITMENT")}
                className="flex-1 inline-flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-4 px-6 rounded-2xl text-sm sm:text-base shadow-lg shadow-amber-500/20 transition"
              >
                <Briefcase className="w-5 h-5" />
                Quiero Formarme como Agente / Líder
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => scrollToApply("CLIENT")}
                className="inline-flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-800 text-white border border-slate-700 font-bold py-4 px-6 rounded-2xl text-sm transition"
              >
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Busco un Seguro para mi Familia
              </button>
            </div>

            {/* Puntos de autoridad */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>100% Remoto en EE. UU.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Ingresos Residuales Vitalicios</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Prospectos (Leads) Provistos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Mentoría desde Cero hasta Licencia</span>
              </div>
            </div>
          </div>

          {/* Tarjeta Ejecutiva de Luis Andrés Salazar */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-slate-800/90 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg">
                  LA
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Mentoría y Liderazgo Directo
                  </span>
                  <h2 className="text-2xl font-extrabold text-white">
                    {leader.fullName}
                  </h2>
                  <p className="text-xs text-slate-300">{leader.agencyName}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-300 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  ¿Cómo funciona nuestro proceso de ingreso?
                </div>
                <div className="space-y-2 text-xs leading-relaxed">
                  <p>
                    <strong className="text-amber-400">Paso 1 (Piscina de Selección):</strong> Completas el test rápido de elegibilidad en menos de 60 segundos.
                  </p>
                  <p>
                    <strong className="text-amber-400">Paso 2 (Primer Contacto + Webinar):</strong> Nuestra asistente te contacta y te habilita la Presentación Ejecutiva Grabada.
                  </p>
                  <p>
                    <strong className="text-amber-400">Paso 3 (Entrevista RRHH):</strong> Evaluación 1 a 1 con Recursos Humanos.
                  </p>
                  <p>
                    <strong className="text-amber-400">Paso 4 (Licencia Estatal):</strong> Te enrolamos para obtener tu licencia oficial de corredor en tu estado.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => scrollToApply("RECRUITMENT")}
                className="w-full py-3.5 px-5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition"
              >
                Iniciar Evaluación de Perfil Ahora
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PILARES DEL MODELO CBG / GLOBE LIFE */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
            Por qué elegir Carta Business Group
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Un Sistema Diseñado para Formar Empresarios en el Sector Financiero
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Comisiones + Residuales Vitalicios
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Gana comisiones semanales por cada familia protegida y construye un ingreso residual (Vested Renewals) que sigues cobrando mes a mes mientras la póliza permanezca activa.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Acceso a Prospectos (Sin vender a amigos)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Contamos con prospectos interesados y además nuestro sistema de marketing digital capta familias que asignamos directamente a los agentes activos de nuestro equipo.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Operación 100% Virtual y Carrera de Liderazgo
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Trabaja desde cualquier estado de EE. UU. usando herramientas digitales, sube de contrato por mérito propio y recibe bonos (overrides) al formar tu propio equipo de agentes.
            </p>
          </div>
        </div>

        {/* Simulador Interactivo */}
        <IncomeSimulator />
      </section>

      {/* SECCIÓN DE APLICACIÓN INTERACTIVA (QUIZ DE RECLUTAMIENTO O PROTECCIÓN) */}
      <section
        id="aplicar-ahora"
        className="py-14 bg-slate-100 border-t border-slate-200"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Selector de Modo */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveFunnel("RECRUITMENT")}
              className={`w-full sm:w-1/2 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
                activeFunnel === "RECRUITMENT"
                  ? "bg-slate-900 text-amber-400 shadow"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              1. Aplicar como Agente / Carrera (1099)
            </button>
            <button
              type="button"
              onClick={() => setActiveFunnel("CLIENT")}
              className={`w-full sm:w-1/2 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
                activeFunnel === "CLIENT"
                  ? "bg-slate-900 text-amber-400 shadow"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              2. Cotizar Seguro / Proteger a mi Familia
            </button>
          </div>

          {activeFunnel === "RECRUITMENT" ? (
            <RecruitmentQuiz
              campaignCode={campaignCode}
              leaderWhatsapp={leader.whatsappNumber}
              leaderName={leader.fullName}
              onSwitchToClientQuiz={() => setActiveFunnel("CLIENT")}
            />
          ) : (
            <ProtectionQuiz
              campaignCode={campaignCode}
              leaderName={leader.fullName}
            />
          )}
        </div>
      </section>

      {/* FOOTER CON SELLO VIRAL PARA COMPAÑEROS DE CBG */}
      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-bold text-white">
              {leader.fullName} — {leader.agencyName}
            </p>
            <p className="mt-1">
              Contratistas Independientes (1099) representando productos de American Income Life / Globe Life.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-amber-400 hover:underline font-semibold"
            >
              Acceso Administrativo (Líder / Asistente / RRHH)
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

