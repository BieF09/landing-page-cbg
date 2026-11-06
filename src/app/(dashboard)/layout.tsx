import React from "react";
import { getCurrentSession } from "@/lib/auth";
import DashboardNav from "@/components/crm/DashboardNav";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  const currentSession = session || {
    id: "fallback",
    name: "Luis Andrés Salazar",
    email: "luis@cbg-system.com",
    role: "LEADER" as const,
    leaderId: "",
    leaderName: "Luis Andrés Salazar",
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <DashboardNav session={currentSession} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
}

