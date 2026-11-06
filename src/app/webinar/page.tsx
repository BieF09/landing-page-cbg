import React from "react";
import { prisma } from "@/lib/prisma";
import WebinarPlayer from "@/components/webinar/WebinarPlayer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WebinarPage({
  searchParams,
}: {
  searchParams?: { lead?: string };
}) {
  const leader = await prisma.leaderProfile.findFirst();
  const leadId = searchParams?.lead;

  let lead = null;
  if (leadId) {
    lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-950/90">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
              CBG
            </div>
            <div>
              <p className="font-bold text-sm">
                {leader?.fullName || "Luis Andrés Salazar"}
              </p>
              <p className="text-xs text-slate-400">
                {leader?.agencyName || "Carta Business Group | Globe Life"}
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-amber-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Inicio
          </Link>
        </div>
      </header>

      <WebinarPlayer
        leadId={lead?.id}
        candidateName={
          lead ? `${lead.firstName} ${lead.lastName}` : "Futuro Agente Asociado"
        }
        initialWatchPct={lead?.webinarWatchPct || 0}
        initialRequestedHr={lead?.requestedHrInterview || false}
        videoUrl={
          leader?.webinarVideoUrl ||
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        }
        webinarTitle={
          leader?.webinarTitle ||
          "Presentación Ejecutiva de Negocio — Carta Business Group"
        }
        leaderName={leader?.fullName || "Luis Andrés Salazar"}
        leaderWhatsapp={leader?.whatsappNumber || "17865550199"}
      />
    </div>
  );
}

