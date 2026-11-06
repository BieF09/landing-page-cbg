# Plan de Tareas Ejecutables (`tasks.md`)

- **Feature Branch:** `001-cbg-lead-system`
- **Inputs:** [spec.md](file:///c:/Users/gbfis/Documents/proyectosProgramacion/landing_page_cbg/specs/001-cbg-lead-system/spec.md), [plan.md](file:///c:/Users/gbfis/Documents/proyectosProgramacion/landing_page_cbg/specs/001-cbg-lead-system/plan.md), [data-model.md](file:///c:/Users/gbfis/Documents/proyectosProgramacion/landing_page_cbg/specs/001-cbg-lead-system/data-model.md)

---

## Fase 1: Inicialización del Proyecto y Base de Datos en Railway (Setup & Foundation)

**Propósito:** Dejar la aplicación Next.js con TypeScript, Tailwind CSS y Prisma conectada a MySQL en Railway con datos semilla listos para probar los 3 roles (Luis Andrés, Asistente y RRHH).

- [x] **T001** Inicializar el proyecto Fullstack con **Next.js (App Router), TypeScript y Tailwind CSS** en la raíz del repositorio, configurando la paleta de colores institucional (`Azul Marino CBG/Globe Life`, `Dorado Ejecutivo`, `Blanco/Gris`).
- [x] **T002** Configurar **Prisma ORM** para **MySQL** (`prisma/schema.prisma`) implementando las entidades de [data-model.md](file:///c:/Users/gbfis/Documents/proyectosProgramacion/landing_page_cbg/specs/001-cbg-lead-system/data-model.md): `LeaderProfile`, `User`, `Campaign`, `Lead`, `LeadActivity`, `WhatsappTemplate` e `ItinJurisdiction`.
- [x] **T003** Conectar la variable `DATABASE_URL` hacia la instancia **MySQL en Railway**, ejecutar la migración inicial (`prisma db push`) y correr el script de semilla (`prisma/seed.ts`) con:
  - Perfil de **Luis Andrés Salazar** (Carta Business Group / Globe Life).
  - Usuarios iniciales de prueba para los 3 roles: `Luis Andrés (LEADER)`, `Asistente (ASSISTANT)`, `Recursos Humanos (HR)` y 2 `Agentes de Equipo (AGENT)`.
  - Reglas iniciales de Estados ITIN, plantillas de WhatsApp listas para usar y campañas demo de Instagram/TikTok.
- [x] **T004** Implementar el sistema de Autenticación y Control de Acceso por Roles (**RBAC**) en `src/lib/auth.ts` y la página `/login` con selector rápido de rol para demostración y pruebas fluidas.

---

## Fase 2: Landing Page de Alta Conversión, Simulador y Motor de Pre-Calificación (US1 & US5)

**Propósito:** Construir la cara pública del sistema optimizada para tráfico móvil de redes sociales con bifurcación inteligente (Reclutamiento vs. Clientes de Pólizas).

- [x] **T005** [US1] Desarrollar la **Landing Page Principal (`/`)** y ruta directa **`/carrera`** con:
  - Hero Section de autoridad para **Luis Andrés Salazar | Carta Business Group (Globe Life)**.
  - Bifurcador claro: *"Desarrolla tu Carrera como Agente (1099)"* vs. *"Protege a tu Familia en EE. UU."*.
  - Captura automática de parámetros de redes sociales (`?src=` / `?utm_campaign=`) e incremento de contador de clics en la tabla `Campaign`.
- [x] **T006** [US1] Construir el **Simulador Interactivo de Comisiones e Ingresos Residuales** (`src/components/landing/IncomeSimulator.tsx`) con controles deslizantes (pólizas por semana + proyección de renovación residual a 12/24 meses y *disclaimer* legal 1099).
- [x] **T007** [US1] Implementar el **Quiz Interactivo de Pre-Calificación de Agentes** (`src/components/landing/RecruitmentQuiz.tsx`) y el motor de elegibilidad (`src/lib/eligibility.ts`) + Endpoint `POST /api/leads`:
  - Valida SSN + Permiso de Trabajo (🟢 `QUALIFIED_HIGH` ➔ `POOL`).
  - Valida ITIN cruzado con Estado/Ciudad en MySQL (🟡 `QUALIFIED_ITIN` ➔ `POOL`).
  - Filtra prospectos sin SSN ni ITIN (🔴 `DISQUALIFIED_DOCS` ➔ No entra a la Piscina de la Asistente y muestra invitación de 1 clic para cotizar un plan de Protección Familiar).
- [x] **T008** [US5] Construir el **Formulario/Quiz de Protección Familiar** (accesible en la Landing y en `/proteccion`) para captar leads de **Clientes de Pólizas (`CLIENT_NEW`)**.

---

## Fase 3: Portal de Webinar Grabado con Telemetría Automática (US3)

**Propósito:** Permitir que cada candidato vea el webinar grabado en una página personalizada que informe en tiempo real a la Asistente y a RRHH quién vio el video.

- [x] **T009** [US3] Crear la página pública personalizada **`/webinar`** (`?lead=[id]`) con la imagen institucional de Luis Andrés Salazar, saludo personalizado al candidato y reproductor de video conectado a la API de telemetría.
- [x] **T010** [US3] Desarrollar el endpoint `POST /api/webinar-tracking` que registra automáticamente en MySQL:
  - Apertura del enlace (`webinarOpenedAt`).
  - Porcentaje de visualización alcanzado (`25%`, `50%`, `80%`, `100%`).
  - Acción del botón **"¡Ya vi el Webinar, quiero mi entrevista con RRHH!"**, que promueve automáticamente al candidato a `READY_FOR_HR` y registra el evento en `LeadActivity`.

---

## Fase 4: Panel Operativo Multi-Rol — Asistente y Recursos Humanos (US2 & US4)

**Propósito:** Entregar las herramientas de trabajo diario adaptadas tanto a teléfono móvil (tarjetas rápidas con disparo a WhatsApp/Llamada) como a PC (tablero Kanban y filtros).

- [x] **T011** [US2] Construir la **Vista Operativa de la Asistente (`/piscina`)**:
  - Bandeja limpia únicamente con candidatos calificados en `POOL` y `CONTACTED_WEBINAR_SENT`.
  - Tarjetas *Mobile-First* con insignia de elegibilidad (`🟢 SSN` / `🟡 ITIN`), origen de red social, botón `Llamar`, contador de intentos (`No contestó 1/2/3`), notas rápidas y **Botón de WhatsApp a 1 Clic** que genera e incluye automáticamente el link único `/webinar?lead={id}` del candidato.
  - Indicador en vivo de si el candidato ya abrió o completó el Webinar.
- [x] **T012** [US4] Construir la **Vista Operativa de Recursos Humanos (`/rrhh`)**:
  - Bandeja enfocada en `READY_FOR_HR`, `HR_INTERVIEWED`, `ENROLLED_LICENSING` y `ACTIVE_AGENT`.
  - Ficha completa del candidato con las respuestas del Quiz, porcentaje de Webinar visto, notas de la Asistente y el **Checklist Interactivo de Entrevista RRHH** (Compromiso, entendimiento 1099, inversión de licencia, fecha de inicio).
  - Botones de WhatsApp con plantillas específicas de RRHH (recordatorio de entrevista y bienvenida al curso de licencia estatal).

---

## Fase 5: Dashboard de Superusuario (Luis Andrés), Redes Sociales y Clientes (US5 & US6)

**Propósito:** Darle a Luis Andrés el centro de mando 360° para medir su negocio, optimizar sus redes sociales, repartir clientes a su equipo y demostrar el sistema a sus compañeros de CBG.

- [x] **T013** [US6] Construir el **Dashboard Ejecutivo del Líder (`/dashboard`)**:
  - Embudo visual de conversión paso a paso (`Piscina` ➔ `Contactados` ➔ `Webinar Visto` ➔ `Entrevista RRHH` ➔ `Enrolados en Licencia` ➔ `Agentes Activos`) con porcentajes de conversión entre cada etapa.
  - Tablero global con vista Kanban en escritorio y tarjetas móviles para supervisar o intervenir en cualquier lead.
- [x] **T014** [US6] Construir el **Módulo de Campañas y Redes Sociales (`/campanas`)**:
  - **Generador de Links para Redes:** Permite crear links rastreables para Instagram Reels, TikTok, etc. apuntando a Reclutamiento (`/carrera?src=...`) o Protección (`/proteccion?src=...`).
  - Tabla comparativa de ROI por publicación: *Clics ➔ Registros ➔ Calificados ➔ Vieron Webinar ➔ Licenciados*.
- [x] **T015** [US5] Construir el **Módulo de Clientes de Pólizas y Asignación al Equipo (`/clientes`)**:
  - Lista de prospectos interesados en seguros (`CLIENT_NEW`, `CLIENT_ASSIGNED`, `CLIENT_CLOSED`).
  - Selector para **asignar un cliente a un agente del equipo de Luis Andrés** y enviarle la ficha completa por WhatsApp con 1 clic.
- [x] **T016** [US6] Construir el **Módulo de Configuración White-Label (`/configuracion`)**:
  - Edición de datos del Líder (Nombre, WhatsApp, URL del video de Webinar), gestión de Estados que aceptan ITIN, edición de plantillas de WhatsApp y administración de usuarios (Asistente, RRHH, Agentes).

---

## Fase 6: Verificación Integral y Pulido Responsivo (Polish & QA)

- [x] **T017** Verificar flujo completo de punta a punta en vistas móvil y escritorio.
