"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, HeartHandshake, ArrowRight } from "lucide-react";

interface ProtectionQuizProps {
  campaignCode?: string;
  leaderName: string;
}

export default function ProtectionQuiz({ campaignCode, leaderName }: ProtectionQuizProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("FL");
  const [familyGroup, setFamilyGroup] = useState("Casado(a) con hijos");
  const [coverageInterest, setCoverageInterest] = useState(
    "Seguro de Vida + Protección de Ingresos Familiares"
  );
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !phone.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadType: "CLIENT",
          firstName,
          lastName,
          phone,
          state,
          campaignCode,
          quizAnswers: {
            familyGroup,
            coverageInterest,
          },
        }),
      });
      if (res.ok) {
        setDone(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900">
          ¡Solicitud de Protección Recibida, {firstName}!
        </h3>
        <p className="text-slate-600 text-sm max-w-md mx-auto">
          Un agente licenciado del equipo de <strong>{leaderName}</strong> en Carta Business Group / Globe Life se comunicará contigo para explicarte los beneficios estatales disponibles para tu familia sin costo ni compromiso.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-amber-400" />
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
              American Income Life / Globe Life
            </span>
            <h3 className="text-lg font-bold">
              Consulta Gratuita de Protección Familiar
            </h3>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              required
              placeholder="Tu nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Apellido
            </label>
            <input
              type="text"
              placeholder="Tu apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Teléfono / WhatsApp *
            </label>
            <input
              type="tel"
              required
              placeholder="(786) 555-0100"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Estado en EE. UU. *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. FL, TX, CA, NY..."
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
            ¿A quién deseas proteger principalmente?
          </label>
          <select
            value={familyGroup}
            onChange={(e) => setFamilyGroup(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
          >
            <option>Casado(a) con hijos</option>
            <option>Pareja sin hijos</option>
            <option>Padre / Madre soltero(a)</option>
            <option>Protección personal y gastos finales</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
            Beneficio de mayor interés:
          </label>
          <select
            value={coverageInterest}
            onChange={(e) => setCoverageInterest(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
          >
            <option>Seguro de Vida + Protección de Ingresos Familiares</option>
            <option>Cobertura de Accidentes y Salud Suplementaria</option>
            <option>Protección Hipotecaria y Fondo Universitario para Hijos</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold py-3.5 px-6 rounded-xl text-sm transition shadow-lg"
        >
          <HeartHandshake className="w-4 h-4" />
          {submitting ? "Enviando solicitud..." : "Solicitar Asesoría Familiar sin Costo"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

