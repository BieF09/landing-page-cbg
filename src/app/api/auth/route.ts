import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || (password && user.passwordHash !== password)) {
      return NextResponse.json(
        { error: "Credenciales inválidas. Usa las cuentas de demostración o verifica tu contraseña." },
        { status: 401 }
      );
    }

    const redirectMap: Record<string, string> = {
      LEADER: "/dashboard",
      ASSISTANT: "/piscina",
      HR: "/rrhh",
      AGENT: "/clientes",
    };

    const res = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      redirectTo: redirectMap[user.role] || "/dashboard",
    });

    res.cookies.set(SESSION_COOKIE_NAME, user.email, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Error interno de autenticación" }, { status: 500 });
  }
}

