import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { UserRole } from "@prisma/client";

export const SESSION_COOKIE_NAME = "cbg_session_email";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  leaderId: string;
  leaderName: string;
}

export async function getCurrentSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const email = cookieStore.get(SESSION_COOKIE_NAME)?.value || "luis@cbg-system.com";

    const user = await prisma.user.findUnique({
      where: { email },
      include: { leader: true },
    });

    if (!user) {
      const fallback = await prisma.user.findFirst({
        include: { leader: true },
      });
      if (!fallback) return null;
      return {
        id: fallback.id,
        name: fallback.name,
        email: fallback.email,
        role: fallback.role,
        leaderId: fallback.leaderId,
        leaderName: fallback.leader.fullName,
      };
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      leaderId: user.leaderId,
      leaderName: user.leader.fullName,
    };
  } catch {
    return null;
  }
}

