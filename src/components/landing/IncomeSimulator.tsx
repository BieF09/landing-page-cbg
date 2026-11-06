"use client";

import React, { useState } from "react";
import { Calculator, TrendingUp, Users, ShieldCheck, Info } from "lucide-react";

export default function IncomeSimulator() {
  const [policiesPerWeek, setPoliciesPerWeek] = useState<number>(3);
  const [avgAnnualPremium, setAvgAnnualPremium] = useState<number>(1200);
  const [contractLevelPct, setContractLevelPct] = useState<number>(55);
  const [teamAgents, setTeamAgents] = useState<number>(2);

  // Cálculos estimados de ejemplo bajo esquema 1099 (Comisión de 1er año + Residuales + Override de Liderazgo)
  const weeklyFirstYearCommission = Math.round(
    policiesPerWeek * avgAnnualPremium * (contractLevelPct / 100) * 0.75
  );
  const monthlyPersonalCommission = weeklyFirstYearCommission * 4;

  // Residuales acumulados al mes 12 (aprox 7% de renovación sobre cartera acumulada activa)
  const annualPoliciesSold = policiesPerWeek * 48;
  const monthlyResidualYear1 = Math.round((annualPoliciesSold * avgAnnualPremium * 0.07) / 12);

  // Override estimado por equipo (carrera de liderazgo)
  const monthlyLeadershipOverride = Math.round(teamAgents * 850);

  const totalEstimatedMonthly =
    monthlyPersonalCommission + monthlyResidualYear1 + monthlyLeadershipOverride;

  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 md:p-8 text-white shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Proyección Financiera Interactiva (Modelo 1099)
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-white">
            Simulador de Comisiones, Residuales y Liderazgo
          </h3>
        </div>
      </div>

      <p className="text-slate-300 text-sm mb-6">
        En <strong className="text-white">Carta Business Group | Globe Life</strong> tus ingresos no tienen techo corporativo. Ajusta las variables para proyectar tu potencial combinando producción personal, renovaciones vitalicias (Vested Renewals) y desarrollo de equipo.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Controles deslizantes */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-slate-300 font-medium">Familias protegidas por semana (Pólizas)</span>
              <span className="text-amber-400 font-bold">{policiesPerWeek} pólizas / sem</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={policiesPerWeek}
              onChange={(e) => setPoliciesPerWeek(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1 (Medio Tiempo)</span>
              <span>5 (Estándar Ejecutivo)</span>
              <span>10 (Top Producer)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-slate-300 font-medium">Prima anual promedio por familia</span>
              <span className="text-amber-400 font-bold">${avgAnnualPremium.toLocaleString("en-US")} USD</span>
            </div>
            <input
              type="range"
              min={800}
              max={2400}
              step={100}
              value={avgAnnualPremium}
              onChange={(e) => setAvgAnnualPremium(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-slate-300 font-medium">Nivel de Contrato / Escalafón</span>
              <span className="text-amber-400 font-bold">{contractLevelPct}% Nivel de Comisión</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Agente Inicial (50%)", val: 50 },
                { label: "Supervising Agent (55%)", val: 55 },
                { label: "Líder / Director (65%)", val: 65 },
              ].map((tier) => (
                <button
                  key={tier.val}
                  type="button"
                  onClick={() => setContractLevelPct(tier.val)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                    contractLevelPct === tier.val
                      ? "bg-amber-500 text-slate-950 border-amber-400"
                      : "bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500"
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" />
                Agentes activos formados en tu equipo (Carrera de Liderazgo)
              </span>
              <span className="text-amber-400 font-bold">{teamAgents} agentes</span>
            </div>
            <input
              type="range"
              min={0}
              max={15}
              value={teamAgents}
              onChange={(e) => setTeamAgents(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Tarjeta de Resultados */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
          <div className="border-b border-slate-700 pb-4">
            <span className="text-xs uppercase tracking-wider text-slate-400">
              Potencial Mensual Combinado Estimado
            </span>
            <div className="text-3xl md:text-4xl font-extrabold text-amber-400 mt-1">
              ${totalEstimatedMonthly.toLocaleString("en-US")} <span className="text-base font-normal text-slate-300">USD / mes</span>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Comisiones Directas (Mes):
              </span>
              <span className="font-bold text-white">${monthlyPersonalCommission.toLocaleString("en-US")}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                Ingreso Residual Mensual (Año 1):
              </span>
              <span className="font-bold text-sky-300">+${monthlyResidualYear1.toLocaleString("en-US")}/mes</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                Bonos y Overrides de Liderazgo:
              </span>
              <span className="font-bold text-amber-300">+${monthlyLeadershipOverride.toLocaleString("en-US")}/mes</span>
            </div>
          </div>

          <div className="bg-slate-950/70 rounded-xl p-3 text-[11px] text-slate-400 flex gap-2 items-start leading-relaxed">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Nota de Transparencia (Contratista Independiente 1099):</strong> Esta calculadora es únicamente ilustrativa. Los agentes operan bajo formato 1099 basado 100% en méritos y producción comercial. Los resultados varían según el compromiso individual y la retención de pólizas.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

