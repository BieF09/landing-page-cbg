import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de datos para Luis Andrés Salazar (CBG / Globe Life)...");

  // 1. Perfil del Líder (White-Label Ready)
  const leader = await prisma.leaderProfile.upsert({
    where: { slug: "luis-andres-salazar" },
    update: {},
    create: {
      slug: "luis-andres-salazar",
      fullName: "Luis Andrés Salazar",
      title: "Líder de Agencia & Formación Empresarial",
      agencyName: "Carta Business Group | Globe Life (AIL)",
      whatsappNumber: "17865550199",
      email: "luis.salazar@cartabusinessgroup.com",
      bio: "Formando a la próxima generación de líderes y empresarios hispanos en la industria financiera y de seguros en Estados Unidos con el respaldo de más de 70 años de American Income Life / Globe Life.",
      webinarVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      webinarTitle: "Presentación Ejecutiva de Negocio: Cómo Construir Ingresos y Carrera en Carta Business Group",
      heroHeadline: "Desarrolla una Carrera Empresarial 100% Remota en el Sector Financiero de EE. UU.",
    },
  });

  // 2. Usuarios del Sistema (RBAC: Líder, Asistente, RRHH y Agentes del Equipo)
  const luisUser = await prisma.user.upsert({
    where: { email: "luis@cbg-system.com" },
    update: {},
    create: {
      leaderId: leader.id,
      name: "Luis Andrés Salazar (Líder Admin)",
      email: "luis@cbg-system.com",
      passwordHash: "demo123",
      phone: "17865550199",
      role: "LEADER",
    },
  });

  const assistantUser = await prisma.user.upsert({
    where: { email: "asistente@cbg-system.com" },
    update: {},
    create: {
      leaderId: leader.id,
      name: "Valeria Gómez (Asistente)",
      email: "asistente@cbg-system.com",
      passwordHash: "demo123",
      phone: "17865550101",
      role: "ASSISTANT",
    },
  });

  const hrUser = await prisma.user.upsert({
    where: { email: "rrhh@cbg-system.com" },
    update: {},
    create: {
      leaderId: leader.id,
      name: "Roberto Méndez (Recursos Humanos)",
      email: "rrhh@cbg-system.com",
      passwordHash: "demo123",
      phone: "17865550102",
      role: "HR",
    },
  });

  const agent1 = await prisma.user.upsert({
    where: { email: "carlos.agente@cbg-system.com" },
    update: {},
    create: {
      leaderId: leader.id,
      name: "Carlos Rivera (Agente Licenciado)",
      email: "carlos.agente@cbg-system.com",
      passwordHash: "demo123",
      phone: "13055550144",
      role: "AGENT",
    },
  });

  const agent2 = await prisma.user.upsert({
    where: { email: "sofia.agente@cbg-system.com" },
    update: {},
    create: {
      leaderId: leader.id,
      name: "Sofía Martínez (Agente Licenciada)",
      email: "sofia.agente@cbg-system.com",
      passwordHash: "demo123",
      phone: "14075550188",
      role: "AGENT",
    },
  });

  // 3. Reglas de Jurisdicción ITIN por Estado
  const itinRules = [
    { stateCode: "FL", stateName: "Florida", cityNotes: "Habilitado con SSN; ITIN sujeto a validación en Miami/Orlando", status: "REQUIRES_CHECK" as const },
    { stateCode: "TX", stateName: "Texas", cityNotes: "Programa ITIN activo en Houston, Dallas y Austin", status: "ALLOWED" as const },
    { stateCode: "CA", stateName: "California", cityNotes: "Licencia estatal permite trámite con ITIN válido", status: "ALLOWED" as const },
    { stateCode: "IL", stateName: "Illinois", cityNotes: "Chicago y área metropolitana permite ITIN", status: "ALLOWED" as const },
    { stateCode: "NY", stateName: "New York", cityNotes: "Permite ITIN bajo revisión de oficina", status: "REQUIRES_CHECK" as const },
  ];

  for (const rule of itinRules) {
    await prisma.itinJurisdiction.upsert({
      where: {
        leaderId_stateCode: {
          leaderId: leader.id,
          stateCode: rule.stateCode,
        },
      },
      update: rule,
      create: {
        leaderId: leader.id,
        ...rule,
      },
    });
  }

  // 4. Plantillas de WhatsApp a 1 Clic
  const existingTemplates = await prisma.whatsappTemplate.count({ where: { leaderId: leader.id } });
  if (existingTemplates === 0) {
    await prisma.whatsappTemplate.createMany({
      data: [
        {
          leaderId: leader.id,
          name: "1. Primer Contacto + Link de Webinar (Asistente)",
          targetRole: "ASSISTANT",
          triggerStage: "POOL",
          body: "¡Hola {{nombre}}! 👋 Te saluda Valeria, asistente ejecutiva del equipo de *{{lider}}* en *Carta Business Group (Globe Life)*. Recibimos tu aplicación desde {{estado}} y tu perfil fue pre-seleccionado. Te comparto tu acceso exclusivo al Webinar de Presentación Oficial de Negocio aquí: {{link_webinar}} — Apenas termines de verlo, presiona el botón debajo del video para pasarte a entrevista con Recursos Humanos.",
        },
        {
          leaderId: leader.id,
          name: "2. Seguimiento: No contestó llamada (Asistente)",
          targetRole: "ASSISTANT",
          triggerStage: "POOL",
          body: "Hola {{nombre}}, intenté comunicarte por teléfono desde la oficina de *{{lider}} (Carta Business Group)* respecto a tu postulación para formarte como Agente Financiero en EE. UU. Te dejo aquí tu acceso personalizado a la presentación de negocio para que no pierdas tu cupo de esta semana: {{link_webinar}}",
        },
        {
          leaderId: leader.id,
          name: "3. Citación a Entrevista con RRHH (Recursos Humanos)",
          targetRole: "HR",
          triggerStage: "READY_FOR_HR",
          body: "¡Felicidades {{nombre}}! 🎯 Vimos en el sistema que ya completaste la Presentación Oficial de Negocio de *Carta Business Group*. Soy Roberto del área de Recursos Humanos del equipo de {{lider}}. ¿Tienes disponibilidad hoy a las 4:00 PM o a las 6:00 PM (hora del Este) para tu entrevista de selección de 15 minutos?",
        },
        {
          leaderId: leader.id,
          name: "4. Bienvenida al Curso de Licencia Estatal (RRHH / Líder)",
          targetRole: "HR",
          triggerStage: "ENROLLED_LICENSING",
          body: "¡Bienvenido oficialmente al proceso de Licencia Estatal, {{nombre}}! 🚀 Todo el equipo de *{{lider}}* en Carta Business Group está listo para apoyarte a aprobar tu examen en {{estado}} en tiempo récord.",
        },
      ],
    });
  }

  // 5. Campañas de Redes Sociales
  const campaign1 = await prisma.campaign.upsert({
    where: { code: "ig-reel-inmigrantes-exito" },
    update: {},
    create: {
      leaderId: leader.id,
      code: "ig-reel-inmigrantes-exito",
      name: "Reel IG: Cómo crecer como hispano en el sector financiero USA",
      platform: "INSTAGRAM",
      targetFunnel: "RECRUITMENT",
      clicksCount: 148,
    },
  });

  const campaign2 = await prisma.campaign.upsert({
    where: { code: "tiktok-residuales-1099" },
    update: {},
    create: {
      leaderId: leader.id,
      code: "tiktok-residuales-1099",
      name: "TikTok: Empleo W-2 vs Ingresos Residuales 1099 en Seguros",
      platform: "TIKTOK",
      targetFunnel: "RECRUITMENT",
      clicksCount: 215,
    },
  });

  const campaign3 = await prisma.campaign.upsert({
    where: { code: "ig-historia-proteccion-familiar" },
    update: {},
    create: {
      leaderId: leader.id,
      code: "ig-historia-proteccion-familiar",
      name: "Historia IG: Protege a tu familia en EE. UU. con Globe Life",
      platform: "INSTAGRAM",
      targetFunnel: "CLIENT",
      clicksCount: 64,
    },
  });

  // 6. Leads Iniciales de Demostración en cada etapa del Embudo
  const existingLeads = await prisma.lead.count({ where: { leaderId: leader.id } });
  if (existingLeads === 0) {
    // Lead 1: En Piscina (Calificado SSN Prioridad Alta)
    const l1 = await prisma.lead.create({
      data: {
        leaderId: leader.id,
        campaignId: campaign1.id,
        leadType: "RECRUITMENT",
        firstName: "Mateo",
        lastName: "Castillo",
        phone: "17865558811",
        email: "mateo.castillo@email.com",
        state: "FL",
        city: "Miami",
        documentStatus: "SSN_WORK_PERMIT",
        qualification: "QUALIFIED_HIGH",
        stage: "POOL",
        callAttempts: 0,
        quizAnswers: {
          currentSituation: "Empleado buscando transición a carrera empresarial",
          availability: "Tiempo completo (100% remoto)",
          compensationMindset: "100% Comisiones + Residuales ilimitados",
        },
        notes: "Aplicó hace 15 minutos desde el Reel de Instagram.",
      },
    });

    // Lead 2: En Piscina (Calificado por ITIN en Texas)
    const l2 = await prisma.lead.create({
      data: {
        leaderId: leader.id,
        campaignId: campaign2.id,
        leadType: "RECRUITMENT",
        firstName: "Daniela",
        lastName: "Vargas",
        phone: "18325559922",
        email: "daniela.v@email.com",
        state: "TX",
        city: "Houston",
        documentStatus: "ITIN",
        qualification: "QUALIFIED_ITIN",
        stage: "POOL",
        callAttempts: 1,
        quizAnswers: {
          currentSituation: "Dueña de pequeño negocio / Emprendedora",
          availability: "Medio tiempo (20+ hrs/sem)",
          compensationMindset: "100% Comisiones + Residuales ilimitados",
        },
        notes: "Intento 1 de llamada realizado. Se envió WhatsApp de seguimiento.",
      },
    });

    // Lead 3: Contactado con Webinar Enviado (Viéndolo al 50%)
    const l3 = await prisma.lead.create({
      data: {
        leaderId: leader.id,
        campaignId: campaign1.id,
        leadType: "RECRUITMENT",
        firstName: "Alejandro",
        lastName: "Mendoza",
        phone: "14075553344",
        email: "alejandro.m@email.com",
        state: "FL",
        city: "Orlando",
        documentStatus: "SSN_WORK_PERMIT",
        qualification: "QUALIFIED_HIGH",
        stage: "CONTACTED_WEBINAR_SENT",
        callAttempts: 1,
        webinarOpenedAt: new Date(Date.now() - 1000 * 60 * 45),
        webinarWatchPct: 50,
        quizAnswers: {
          currentSituation: "Ventas en otra industria",
          availability: "Tiempo completo (100% remoto)",
          compensationMindset: "100% Comisiones + Residuales ilimitados",
        },
        notes: "Valeria habló con él, muy entusiasmado. Ya abrió el link del webinar.",
      },
    });

    // Lead 4: Vio el Webinar 100% y solicitó entrevista -> Listo para RRHH
    const l4 = await prisma.lead.create({
      data: {
        leaderId: leader.id,
        campaignId: campaign2.id,
        leadType: "RECRUITMENT",
        firstName: "Gabriela",
        lastName: "Rojas",
        phone: "12145556677",
        email: "gabriela.rojas@email.com",
        state: "TX",
        city: "Dallas",
        documentStatus: "SSN_WORK_PERMIT",
        qualification: "QUALIFIED_HIGH",
        stage: "READY_FOR_HR",
        callAttempts: 1,
        webinarOpenedAt: new Date(Date.now() - 1000 * 60 * 120),
        webinarWatchPct: 100,
        requestedHrInterview: true,
        quizAnswers: {
          currentSituation: "Buscando carrera en finanzas",
          availability: "Tiempo completo (100% remoto)",
          compensationMindset: "100% Comisiones + Residuales ilimitados",
        },
        notes: "Completó el 100% del webinar y presionó el botón para agendar entrevista con RRHH.",
      },
    });

    // Lead 5: Enrolado en Licencia (Pre-licensing)
    await prisma.lead.create({
      data: {
        leaderId: leader.id,
        campaignId: campaign1.id,
        leadType: "RECRUITMENT",
        firstName: "Fernando",
        lastName: "Pineda",
        phone: "13055557788",
        email: "fpineda@email.com",
        state: "FL",
        city: "Doral",
        documentStatus: "SSN_WORK_PERMIT",
        qualification: "QUALIFIED_HIGH",
        stage: "ENROLLED_LICENSING",
        callAttempts: 1,
        webinarOpenedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        webinarWatchPct: 100,
        requestedHrInterview: true,
        hrChecklist: {
          understands1099: true,
          fullTimeCommitment: true,
          licenseFeeReady: true,
          examTargetDate: "2026-11-20",
        },
        notes: "Excelente perfil comercial. Ya pagó su curso de pre-licencia en Florida.",
      },
    });

    // Lead 6: Filtrado automáticamente (Sin SSN ni ITIN) -> No contamina la Piscina
    await prisma.lead.create({
      data: {
        leaderId: leader.id,
        campaignId: campaign2.id,
        leadType: "RECRUITMENT",
        firstName: "Jorge",
        lastName: "Luna",
        phone: "17865550099",
        email: "jluna@email.com",
        state: "FL",
        city: "Hialeah",
        documentStatus: "NONE",
        qualification: "DISQUALIFIED_DOCS",
        stage: "DISCARDED",
        notes: "Filtrado automáticamente por el Quiz: aún no cuenta con SSN ni ITIN.",
      },
    });

    // Lead 7: Cliente de Póliza (Protección Familiar) para asignar al equipo
    await prisma.lead.create({
      data: {
        leaderId: leader.id,
        campaignId: campaign3.id,
        leadType: "CLIENT",
        firstName: "Familia Morales",
        lastName: "(Andrés y Elena)",
        phone: "17865554433",
        email: "amorales@email.com",
        state: "FL",
        city: "Kendall",
        documentStatus: "NOT_APPLICABLE",
        qualification: "CLIENT_LEAD",
        stage: "CLIENT_NEW",
        quizAnswers: {
          familyGroup: "Casado con 2 hijos",
          coverageInterest: "Seguro de Vida + Protección de Ingresos Familiares",
          preferredSchedule: "Tardes después de las 5:00 PM",
        },
        notes: "Solicitan asesoría sin costo para proteger a su familia e hipoteca.",
      },
    });

    // Lead 8: Cliente ya asignado a un Agente del Equipo de Luis Andrés
    await prisma.lead.create({
      data: {
        leaderId: leader.id,
        campaignId: campaign3.id,
        leadType: "CLIENT",
        firstName: "Mariana",
        lastName: "Solís",
        phone: "14075551122",
        email: "msolis@email.com",
        state: "FL",
        city: "Kissimmee",
        documentStatus: "NOT_APPLICABLE",
        qualification: "CLIENT_LEAD",
        stage: "CLIENT_ASSIGNED",
        assignedAgentId: agent1.id,
        quizAnswers: {
          familyGroup: "Madre con 1 hijo",
          coverageInterest: "Seguro de Vida y Salud Suplementaria",
          preferredSchedule: "Mañanas",
        },
        notes: "Asignado por Luis Andrés al agente Carlos Rivera.",
      },
    });

    await prisma.leadActivity.createMany({
      data: [
        {
          leadId: l1.id,
          actionType: "CREATED",
          description: "Lead captado y pre-calificado como PRIORIDAD ALTA (SSN + Permiso de Trabajo) desde Reel de Instagram.",
        },
        {
          leadId: l2.id,
          userId: assistantUser.id,
          actionType: "CALL_ATTEMPT",
          description: "Valeria Gómez (Asistente) registró Intento de llamada #1.",
        },
        {
          leadId: l3.id,
          userId: assistantUser.id,
          actionType: "WHATSAPP_SENT",
          description: "Valeria Gómez envió acceso al Webinar por WhatsApp.",
        },
        {
          leadId: l4.id,
          actionType: "WEBINAR_PROGRESS",
          description: "Gabriela Rojas completó el 100% del Webinar y solicitó entrevista con RRHH.",
        },
      ],
    });
  }

  console.log("✅ Seed completado exitosamente en Railway MySQL.");
  console.log({
    leader: leader.fullName,
    users: [luisUser.email, assistantUser.email, hrUser.email, agent1.email, agent2.email],
  });
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

