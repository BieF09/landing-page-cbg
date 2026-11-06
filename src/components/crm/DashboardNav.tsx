"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PhoneCall,
  UserCheck,
  HeartHandshake,
  Share2,
  Settings,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

interface DashboardNavProps {
  session: {
    name: string;
    email: string;
    role: "LEADER" | "ASSISTANT" | "HR" | "AGENT";
    leaderName: string;
  };
}

export default function DashboardNav({ session }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function quickSwitchRole(email: string) {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: "demo123" }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push(data.redirectTo || "/dashboard");
      router.refresh();
    }
  }

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard 360°",
      icon: LayoutDashboard,
      roles: ["LEADER"],
    },
    {
      href: "/piscina",
      label: "La Piscina (Asistente)",
      icon: PhoneCall,
      roles: ["LEADER", "ASSISTANT"],
    },
    {
      href: "/rrhh",
      label: "Entrevistas & Licencia (RRHH)",
      icon: UserCheck,
      roles: ["LEADER", "HR"],
    },
    {
      href: "/clientes",
      label: "Clientes Pólizas & Equipo",
      icon: HeartHandshake,
      roles: ["LEADER", "AGENT"],
    },
    {
      href: "/campanas",
      label: "Links Redes Sociales",
      icon: Share2,
      roles: ["LEADER"],
    },
    {
      href: "/configuracion",
      label: "Configuración White-Label",
      icon: Settings,
      roles: ["LEADER"],
    },
  ].filter((item) => item.roles.includes(session.role));

  return (
    <div className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Identidad y Rol Activo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
            CBG
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">{session.name}</span>
              <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {session.role === "LEADER"
                  ? "Líder Superusuario"
                  : session.role === "ASSISTANT"
                  ? "Perfil Asistente"
                  : session.role === "HR"
                  ? "Perfil RRHH"
                  : "Agente"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Organización: {session.leaderName} — Carta Business Group
            </p>
          </div>
        </div>

        {/* Selector Rápido de Rol para Demostración + Link a Landing */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <span className="px-2 text-slate-400 hidden sm:inline flex items-center gap-1">
              <RefreshCw className="w-3 h-3 inline mr-1" />
              Vista:
            </span>
            <button
              type="button"
              onClick={() => quickSwitchRole("luis@cbg-system.com")}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                session.role === "LEADER"
                  ? "bg-amber-500 text-slate-950"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              Líder (Luis)
            </button>
            <button
              type="button"
              onClick={() => quickSwitchRole("asistente@cbg-system.com")}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                session.role === "ASSISTANT"
                  ? "bg-sky-400 text-slate-950"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              Asistente
            </button>
            <button
              type="button"
              onClick={() => quickSwitchRole("rrhh@cbg-system.com")}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                session.role === "HR"
                  ? "bg-emerald-400 text-slate-950"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              RRHH
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-2 rounded-xl border border-slate-700 transition"
          >
            <span>Ver Landing</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Pestañas de navegación adaptadas al rol */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-900">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                active
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

