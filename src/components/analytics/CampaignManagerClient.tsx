"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Share2,
  PlusCircle,
  Copy,
  Check,
  TrendingUp,
  ExternalLink,
} from "lucide-react";

interface CampaignMetric {
  id: string;
  code: string;
  name: string;
  platform: string;
  targetFunnel: string;
  clicksCount: number;
  totalLeads: number;
  qualifiedLeads: number;
  webinarWatched: number;
  enrolledLicensing: number;
}

export default function CampaignManagerClient({
  initialCampaigns,
}: {
  initialCampaigns: CampaignMetric[];
}) {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<CampaignMetric[]>(initialCampaigns);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [platform, setPlatform] = useState("INSTAGRAM");
  const [targetFunnel, setTargetFunnel] = useState("RECRUITMENT");
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCreateCampaign(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          code,
          platform,
          targetFunnel,
        }),
      });
      const data = await res.json();
      if (res.ok && data.campaign) {
        setCampaigns((prev) => [
          {
            ...data.campaign,
            totalLeads: 0,
            qualifiedLeads: 0,
            webinarWatched: 0,
            enrolledLicensing: 0,
          },
          ...prev,
        ]);
        setName("");
        setCode("");
        router.refresh();
      }
    } finally {
      setCreating(false);
    }
  }

  function buildFullUrl(camp: CampaignMetric) {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";
    const route =
      camp.targetFunnel === "CLIENT" ? "/proteccion" : "/carrera";
    return `${origin}${route}?src=${camp.code}`;
  }

  function copyLink(camp: CampaignMetric) {
    const url = buildFullUrl(camp);
    navigator.clipboard.writeText(url);
    setCopiedId(camp.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
          Atribución de Marketing Digital — Instagram, TikTok, Facebook & WhatsApp
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold">
          Generador de Links para Redes Sociales & ROI por Publicación
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
          Crea un enlace único para cada Reel, TikTok o Historia que publiques. El sistema mide automáticamente no solo cuántos clics dio tu video, sino cuántos de esos prospectos vieron el Webinar y se enrolaron en la Licencia Estatal.
        </p>
      </div>

      {/* Generador de Nuevo Link */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 mb-4">
          <PlusCircle className="w-5 h-5 text-amber-600" />
          Crear Nuevo Enlace Rastreable para una Publicación
        </h2>

        <form
          onSubmit={handleCreateCampaign}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
        >
          <div className="md:col-span-4">
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Nombre del Reel / Video / Campaña *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Reel: Cómo emprender en seguros en USA"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!code) {
                  setCode(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .slice(0, 28)
                  );
                }
              }}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Código Corto (?src=) *
            </label>
            <input
              type="text"
              required
              placeholder="ej. ig-reel-finanzas"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Red Social
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
            >
              <option value="INSTAGRAM">Instagram</option>
              <option value="TIKTOK">TikTok</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="WHATSAPP">WhatsApp</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Embudo de Destino
            </label>
            <div className="flex gap-2">
              <select
                value={targetFunnel}
                onChange={(e) => setTargetFunnel(e.target.value)}
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
              >
                <option value="RECRUITMENT">Reclutar Agentes (/carrera)</option>
                <option value="CLIENT">Captar Clientes (/proteccion)</option>
              </select>
              <button
                type="submit"
                disabled={creating}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs whitespace-nowrap transition shadow"
              >
                {creating ? "..." : "+ Crear"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Tabla Comparativa de Rendimiento de Redes Sociales */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-extrabold text-slate-900">
              Rendimiento por Campaña (De Clic en Red Social a Licencia Estatal)
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-600">
                <th className="py-3.5 px-5">Campaña / Red Social</th>
                <th className="py-3.5 px-4">Destino</th>
                <th className="py-3.5 px-4 text-center">Clics</th>
                <th className="py-3.5 px-4 text-center">Registrados</th>
                <th className="py-3.5 px-4 text-center">Calificados (SSN/ITIN)</th>
                <th className="py-3.5 px-4 text-center">Vieron Webinar</th>
                <th className="py-3.5 px-4 text-center">Enrolados Licencia</th>
                <th className="py-3.5 px-5 text-right">Enlace para tu Bio / Video</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50/80">
                  <td className="py-4 px-5">
                    <div className="font-extrabold text-slate-900 text-sm">
                      {camp.name}
                    </div>
                    <div className="text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-bold text-amber-600">
                        {camp.platform}
                      </span>
                      <span>•</span>
                      <span className="font-mono">?src={camp.code}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                        camp.targetFunnel === "RECRUITMENT"
                          ? "bg-slate-900 text-amber-400"
                          : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {camp.targetFunnel === "RECRUITMENT"
                        ? "Reclutamiento"
                        : "Clientes Pólizas"}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center font-bold text-slate-800">
                    {camp.clicksCount}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-slate-900">
                    {camp.totalLeads}
                  </td>
                  <td className="py-4 px-4 text-center font-extrabold text-emerald-700">
                    {camp.qualifiedLeads}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-sky-700">
                    {camp.webinarWatched}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black">
                      {camp.enrolledLicensing}
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyLink(camp)}
                        className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-3 py-2 rounded-xl transition"
                      >
                        {copiedId === camp.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copiar Link
                          </>
                        )}
                      </button>
                      <a
                        href={`${
                          camp.targetFunnel === "CLIENT"
                            ? "/proteccion"
                            : "/carrera"
                        }?src=${camp.code}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600"
                        title="Probar enlace"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

