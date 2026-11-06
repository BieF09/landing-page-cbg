"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Sparkles,
  FileCheck2,
  MapPin,
  Briefcase,
  UserCheck,
  MessageCircle,
  HeartHandshake,
} from "lucide-react";

const US_STATES = [
  { code: "FL", name: "Florida (FL)" },
  { code: "TX", name: "Texas (TX)" },
  { code: "CA", name: "California (CA)" },
  { code: "NY", name: "New York (NY)" },
  { code: "IL", name: "Illinois (IL)" },
  { code: "NJ", name: "New Jersey (NJ)" },
  { code: "GA", name: "Georgia (GA)" },
  { code: "NC", name: "North Carolina (NC)" },
  { code: "AZ", name: "Arizona (AZ)" },
  { code: "NV", name: "Nevada (NV)" },
  { code: "PA", name: "Pennsylvania (PA)" },
  { code: "VA", name: "Virginia (VA)" },
  { code: "CO", name: "Colorado (CO)" },
  { code: "OTRO", name: "Otro Estado de EE. UU." },
];

interface RecruitmentQuizProps {
  campaignCode?: string;
  leaderWhatsapp: string;
  leaderName: string;
  onSwitchToClientQuiz?: () => void;
}

export default function RecruitmentQuiz({
  campaignCode,
  leaderWhatsapp,
  leaderName,
  onSwitchToClientQuiz,
}: RecruitmentQuizProps) {
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    leadId: string;
    qualification: string;
    badgeLabel: string;
    userMessage: string;
  } | null>(null);

  // Respuestas del Quiz
  const [state, setState] = useState("FL");
  const [city, setCity] = useState("");
  const [documentStatus, setDocumentStatus] = useState<
    "SSN_WORK_PERMIT" | "ITIN" | "NONE"
  >("SSN_WORK_PERMIT");
  const [currentSituation, setCurrentSituation] = useState(
    "Busco transición a una carrera empresarial"
  );
  const [availability, setAvailability] = useState("Tiempo completo (100% remoto)");
  const [compensationMindset, setCompensationMindset] = useState(
    "Comisiones sin techo + Ingresos Residuales (1099)"
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !phone.trim()) {
      setErrorMsg("Por favor ingresa tu nombre y número de WhatsApp/Teléfono.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadType: "RECRUITMENT",
          firstName,
          lastName,
          phone,
          email,
          state,
          city,
          documentStatus,
          campaignCode,
          quizAnswers: {
            currentSituation,
            availability,
            compensationMindset,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "No se pudo procesar tu aplicación.");
      } else {
        setResult({
          leadId: data.lead.id,
          qualification: data.eligibility.qualification,
          badgeLabel: data.eligibility.badgeLabel,
          userMessage: data.eligibility.userMessage,
        });
      }
    } catch {
      setErrorMsg("Error de red al enviar tu aplicación.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    const isDisqualified = result.qualification === "DISQUALIFIED_DOCS";
    const waDirect = `https://wa.me/${leaderWhatsapp}?text=${encodeURIComponent(
      `¡Hola ${leaderName}! Acabo de completar mi aplicación para tu equipo en Carta Business Group desde ${state}. Mi nombre es ${firstName} ${lastName}.`
    )}`;

    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xl text-center space-y-5">
        <div
          className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
            isDisqualified
              ? "bg-amber-100 text-amber-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {isDisqualified ? (
            <ShieldAlert className="w-8 h-8" />
          ) : (
            <CheckCircle2 className="w-8 h-8" />
          )}
        </div>

        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
          {result.badgeLabel}
        </span>

        <h3 className="text-2xl font-extrabold text-slate-900">
          {isDisqualified
            ? `Gracias por tu interés, ${firstName}`
            : `¡Felicidades ${firstName}! Tu perfil entró a nuestra Piscina Prioritaria`}
        </h3>

        <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          {result.userMessage}
        </p>

        {!isDisqualified ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-3">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              ¿Cuáles son tus próximos pasos en el proceso de selección?
            </h4>
            <ol className="text-sm text-slate-700 space-y-2 list-decimal list-inside">
              <li>
                <strong>Llamada de Primer Contacto:</strong> Nuestra Asistente Ejecutiva te contactará para darte acceso a la{" "}
                <span className="font-semibold text-slate-900">
                  Presentación Oficial Grabada (Webinar)
                </span>
                .
              </li>
              <li>
                <strong>Entrevista con Recursos Humanos:</strong> Al finalizar el Webinar, desbloquearás tu entrevista 1 a 1 con RRHH.
              </li>
              <li>
                <strong>Enrolamiento a Licencia Estatal:</strong> Inicio de tu formación como Agente Licenciado en {state}.
              </li>
            </ol>

            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <a
                href={`/webinar?lead=${result.leadId}`}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold py-3 px-5 rounded-xl text-sm transition shadow"
              >
                <Sparkles className="w-4 h-4" />
                Adelantarme y Ver el Webinar Ahora
              </a>
              <a
                href={waDirect}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-xl text-sm transition"
              >
                <MessageCircle className="w-4 h-4" />
                Notificar por WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-3">
            <p className="text-sm text-amber-900 font-medium">
              Aunque hoy no puedas tramitar la licencia de agente, aún puedes proteger a tu familia en EE. UU. con los beneficios de Globe Life (sin requerir estatus migratorio para contratar una póliza).
            </p>
            {onSwitchToClientQuiz && (
              <button
                type="button"
                onClick={onSwitchToClientQuiz}
                className="inline-flex items-center gap-2 bg-slate-900 text-amber-400 font-bold py-3 px-6 rounded-xl text-sm hover:bg-slate-800 transition"
              >
                <HeartHandshake className="w-4 h-4" />
                Solicitar Información de Protección Familiar Gratuita
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Barra de progreso */}
      <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            Evaluación de Elegibilidad — Equipo {leaderName}
          </span>
          <h3 className="text-lg font-bold">
            Aplicación para Carrera de Agente & Liderazgo
          </h3>
        </div>
        <span className="text-xs font-bold bg-amber-500 text-slate-950 px-3 py-1 rounded-full">
          Paso {step} de 3
        </span>
      </div>

      <div className="w-full bg-slate-200 h-1.5">
        <div
          className="bg-amber-500 h-1.5 transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <MapPin className="w-5 h-5 text-amber-600" />
              <span>1. Ubicación y Documentación para Licencia Estatal</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Estado donde resides en EE. UU. *
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {US_STATES.map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Ciudad / Condado
                </label>
                <input
                  type="text"
                  placeholder="Ej. Miami, Houston, Orlando..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-amber-600" />
                Para tramitar la licencia estatal de seguros en EE. UU., ¿con cuál documento cuentas? *
              </label>
              <p className="text-xs text-slate-500 mb-3">
                (Nunca te pediremos el número por este medio, solo confirmamos elegibilidad regulatoria).
              </p>
              <div className="space-y-2.5">
                {[
                  {
                    id: "SSN_WORK_PERMIT",
                    title: "Social Security Number (SSN) + Permiso de Trabajo / Residencia / Ciudadanía",
                    desc: "Elegibilidad inmediata en todos los estados de EE. UU.",
                  },
                  {
                    id: "ITIN",
                    title: "Cuento con ITIN Number (Tax ID)",
                    desc: "Aplica en estados y ciudades específicas habilitadas por regulación.",
                  },
                  {
                    id: "NONE",
                    title: "Aún no cuento con SSN ni ITIN en Estados Unidos",
                    desc: "Evaluaremos alternativas informativas para ti.",
                  },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                      documentStatus === opt.id
                        ? "border-amber-500 bg-amber-50/60 ring-1 ring-amber-500"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="documentStatus"
                      checked={documentStatus === opt.id}
                      onChange={() =>
                        setDocumentStatus(
                          opt.id as "SSN_WORK_PERMIT" | "ITIN" | "NONE"
                        )
                      }
                      className="mt-1 accent-amber-600"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {opt.title}
                      </div>
                      <div className="text-xs text-slate-500">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold py-3 px-6 rounded-xl text-sm transition"
              >
                Siguiente Paso
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <Briefcase className="w-5 h-5 text-amber-600" />
              <span>2. Perfil Profesional y Modalidad 1099</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                ¿Cuál describe mejor tu momento actual?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  "Busco transición a una carrera empresarial",
                  "Tengo empleo pero busco mayores ingresos",
                  "Tengo experiencia en ventas / atención al cliente",
                  "Quiero emprender y liderar equipos en EE. UU.",
                ].map((sit) => (
                  <button
                    key={sit}
                    type="button"
                    onClick={() => setCurrentSituation(sit)}
                    className={`text-left p-3 rounded-xl border text-xs font-semibold transition ${
                      currentSituation === sit
                        ? "border-amber-500 bg-amber-50 text-slate-900 ring-1 ring-amber-500"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {sit}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                Disponibilidad para capacitarte y operar 100% remoto:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  "Tiempo completo (100% remoto)",
                  "Medio tiempo comprometido (20+ hrs/sem)",
                ].map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setAvailability(av)}
                    className={`text-left p-3 rounded-xl border text-xs font-semibold transition ${
                      availability === av
                        ? "border-amber-500 bg-amber-50 text-slate-900 ring-1 ring-amber-500"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                Nuestro modelo en Carta Business Group es 100% meritocrático (Contratista 1099). ¿Con cuál te identificas?
              </label>
              <div className="space-y-2">
                {[
                  "Comisiones sin techo + Ingresos Residuales + Bonos de Liderazgo (1099)",
                  "Solo busco un sueldo fijo por hora (W-2)",
                ].map((mind) => (
                  <button
                    key={mind}
                    type="button"
                    onClick={() => setCompensationMindset(mind)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition ${
                      compensationMindset === mind
                        ? "border-amber-500 bg-amber-50 text-slate-900 ring-1 ring-amber-500"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {mind}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold py-2.5 px-4 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Atrás
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold py-3 px-6 rounded-xl text-sm transition"
              >
                Último Paso
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <UserCheck className="w-5 h-5 text-amber-600" />
              <span>3. Tus Datos para Recibir el Webinar y Contacto</span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

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
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tu apellido"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Teléfono / WhatsApp (EE. UU.) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. (786) 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="tucorreo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold py-2.5 px-4 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Atrás
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3.5 px-7 rounded-xl text-sm shadow-lg transition disabled:opacity-50"
              >
                {submitting
                  ? "Evaluando y Registrando..."
                  : "Enviar Aplicación y Desbloquear Webinar"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

