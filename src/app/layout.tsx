import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luis Andrés Salazar | Carta Business Group — Globe Life",
  description:
    "Desarrolla una carrera empresarial en la industria financiera en EE. UU. o protege el futuro de tu familia con el respaldo de Carta Business Group y Globe Life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}

