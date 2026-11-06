"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, UserCheck, PhoneCall, Briefcase, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";

const DEMO_ROLES = [
  {
    role: "LEADER",
    title: "Luis Andrés Salazar (Superusuario / Líder)",
    email: "luis@cbg-system.com",
    desc: "Acceso total 360°: Dashboard de conversión, Embudo completo, Redes Sociales, Asignación de clientes al equipo y Configuración.",
    badge: "Superusuario Admin",
    color: "border-amber-500 bg-amber-500/10 text-amber-300",
    icon: Shield,
  },
  {
    role: "ASSISTANT",
    title: "Valeria Gómez (Perfil Asistente)",
    email: "asistente@cbg-system.com",
    desc: "Acceso enfocado en La Piscina de Leads Calificados, cola de llamadas rápidas, envío de link de Webinar por WhatsApp a 1 clic y seguimiento.",
    badge: "Primer Contacto & Webinar",
    color: "border-sky-500 bg-sky-500/10 text-sky-300",
    icon: PhoneCall,
  },
  {
    role: "HR",
    title: "Roberto Méndez (Perfil Recursos Humanos)",
    email: "rrhh@cbg-system.com",
    desc: "Acceso a candidatos que ya vieron el Webinar, Checklist de Entrevista de Selección y Enrolamiento al curso de Licencia Estatal.",
    badge: "Entrevista & Licencia",
    color: "border-emerald-500 bg-emerald-500/10 text-emerald-300",
    icon: UserCheck,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("luis@cbg-system.com");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loginWithAccount(targetEmail: string, targetPass = "demo123") {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, password: targetPass }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión");
      } else {
        router.push(data.redirectTo || "/dashboard");
        router.refresh();
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 hover:underline"
          >
            ← Volver a la Landing Page Pública
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            Sistema Operativo CBG — Acceso por Roles
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Selecciona con 1 clic el perfil que deseas probar (Líder Superusuario, Asistente o Recursos Humanos) o ingresa tus credenciales.
          </p>
        </div>

        {/* Tarjetas de Acceso Rápido por Rol */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_ROLES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.role}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.color}`}
                    >
                      {item.badge}
                    </span>
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="font-bold text-base text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => loginWithAccount(item.email, "demo123")}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  Entrar como {item.role === "LEADER" ? "Luis Andrés" : item.role === "ASSISTANT" ? "Asistente" : "RRHH"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Formulario tradicional */}
        <div className="max-w-md mx-auto w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Ingreso con Correo y Contraseña</span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginWithAccount(email, password);
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Contraseña (Demo: demo123)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2 text-sm text-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              {loading ? "Verificando acceso..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

