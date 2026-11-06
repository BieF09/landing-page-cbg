"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Save, MapPin, MessageCircle, Video, Check } from "lucide-react";

interface LeaderSettings {
  id: string;
  fullName: string;
  title: string;
  agencyName: string;
  whatsappNumber: string;
  webinarVideoUrl: string;
  webinarTitle: string;
  heroHeadline: string;
}

interface ItinRule {
  id: string;
  stateCode: string;
  stateName: string;
  cityNotes: string | null;
  status: string;
}

interface WhatsappTpl {
  id: string;
  name: string;
  targetRole: string;
  body: string;
}

export default function SettingsManagerClient({
  initialLeader,
  initialItinRules,
  initialTemplates,
}: {
  initialLeader: LeaderSettings;
  initialItinRules: ItinRule[];
  initialTemplates: WhatsappTpl[];
}) {
  const router = useRouter();
  const [leader, setLeader] = useState<LeaderSettings>(initialLeader);
  const [itinRules, setItinRules] = useState<ItinRule[]>(initialItinRules);
  const [templates, setTemplates] = useState<WhatsappTpl[]>(initialTemplates);
  const [saving, setSaving] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);

  // Nuevo estado ITIN
  const [newStateCode, setNewStateCode] = useState("");
  const [newStateName, setNewStateName] = useState("");
  const [newCityNotes, setNewCityNotes] = useState("");
  const [newStatus, setNewStatus] = useState("ALLOWED");

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_PROFILE",
          ...leader,
        }),
      });
      if (res.ok) {
        setSavedBanner(true);
        setTimeout(() => setSavedBanner(false), 2500);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleAddItinRule(e: React.FormEvent) {
    e.preventDefault();
    if (!newStateCode.trim() || !newStateName.trim()) return;
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "UPSERT_ITIN_RULE",
        stateCode: newStateCode,
        stateName: newStateName,
        cityNotes: newCityNotes,
        status: newStatus,
      }),
    });
    const data = await res.json();
    if (res.ok && data.rule) {
      setItinRules((prev) => {
        const exists = prev.find((r) => r.stateCode === data.rule.stateCode);
        if (exists) {
          return prev.map((r) =>
            r.stateCode === data.rule.stateCode ? data.rule : r
          );
        }
        return [...prev, data.rule];
      });
      setNewStateCode("");
      setNewStateName("");
      setNewCityNotes("");
      router.refresh();
    }
  }

  async function handleSaveTemplate(tpl: WhatsappTpl) {
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "UPDATE_TEMPLATE",
        id: tpl.id,
        name: tpl.name,
        body: tpl.body,
      }),
    });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2000);
  }

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
            Arquitectura White-Label (Plantilla Comercializable para Líderes CBG)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Configuración de Marca Personal, Webinar, Reglas ITIN y Plantillas
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Personaliza en segundos los datos del Líder, el enlace del video del Webinar, los estados donde se acepta ITIN y los guiones automáticos de WhatsApp.
          </p>
        </div>

        {savedBanner && (
          <div className="inline-flex items-center gap-2 bg-emerald-500 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs shadow">
            <Check className="w-4 h-4" />
            Cambios Guardados en Railway MySQL
          </div>
        )}
      </div>

      {/* 1. Perfil del Líder y Video del Webinar */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-600" />
            1. Identidad del Líder & Enlace del Webinar Grabado
          </h2>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow transition"
          >
            <Save className="w-4 h-4" />
            {saving ? "Guardando..." : "Guardar Perfil y Webinar"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Nombre del Líder
            </label>
            <input
              type="text"
              value={leader.fullName}
              onChange={(e) =>
                setLeader({ ...leader, fullName: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Cargo / Título
            </label>
            <input
              type="text"
              value={leader.title}
              onChange={(e) => setLeader({ ...leader, title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              WhatsApp Oficial (con código país, ej. 1786...)
            </label>
            <input
              type="text"
              value={leader.whatsappNumber}
              onChange={(e) =>
                setLeader({ ...leader, whatsappNumber: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1 flex items-center gap-1">
              <Video className="w-4 h-4 text-amber-600" />
              URL del Video del Webinar Grabado (MP4 o YouTube Embed)
            </label>
            <input
              type="text"
              value={leader.webinarVideoUrl}
              onChange={(e) =>
                setLeader({ ...leader, webinarVideoUrl: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Título Principal en la Landing Page (Hero Headline)
            </label>
            <input
              type="text"
              value={leader.heroHeadline}
              onChange={(e) =>
                setLeader({ ...leader, heroHeadline: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>
        </div>
      </form>

      {/* 2. Reglas de Estados y Ciudades para ITIN */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-600" />
          2. Reglas de Elegibilidad ITIN por Estado / Ciudad
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {itinRules.map((rule) => (
            <div
              key={rule.stateCode}
              className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900">
                  {rule.stateName} ({rule.stateCode})
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    rule.status === "ALLOWED"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {rule.status === "ALLOWED"
                    ? "ITIN Habilitado"
                    : "Validar Ciudad"}
                </span>
              </div>
              <p className="text-xs text-slate-600">{rule.cityNotes}</p>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleAddItinRule}
          className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2 border-t border-slate-100"
        >
          <input
            type="text"
            placeholder="Código (Ej. NJ)"
            maxLength={4}
            value={newStateCode}
            onChange={(e) => setNewStateCode(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold uppercase"
          />
          <input
            type="text"
            placeholder="Nombre Estado (New Jersey)"
            value={newStateName}
            onChange={(e) => setNewStateName(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs"
          />
          <input
            type="text"
            placeholder="Notas de ciudades permitidas"
            value={newCityNotes}
            onChange={(e) => setNewCityNotes(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs sm:col-span-2"
          />
          <div className="flex gap-2">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="rounded-xl border border-slate-300 px-2 py-2 text-xs flex-1"
            >
              <option value="ALLOWED">Habilitado</option>
              <option value="REQUIRES_CHECK">Revisar</option>
            </select>
            <button
              type="submit"
              className="bg-slate-900 text-amber-400 font-bold px-3.5 py-2 rounded-xl text-xs"
            >
              + Guardar
            </button>
          </div>
        </form>
      </div>

      {/* 3. Plantillas de WhatsApp a 1 Clic */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-emerald-600" />
          3. Plantillas de WhatsApp a 1 Clic (Variables: {"{{nombre}}"},{" "}
          {"{{lider}}"}, {"{{estado}}"}, {"{{link_webinar}}"})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tpl, idx) => (
            <div
              key={tpl.id}
              className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">
                  {tpl.name}
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  Rol: {tpl.targetRole}
                </span>
              </div>
              <textarea
                rows={4}
                value={tpl.body}
                onChange={(e) => {
                  const copy = [...templates];
                  copy[idx] = { ...tpl, body: e.target.value };
                  setTemplates(copy);
                }}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs leading-relaxed"
              />
              <button
                type="button"
                onClick={() => handleSaveTemplate(templates[idx])}
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs"
              >
                Guardar Plantilla
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

