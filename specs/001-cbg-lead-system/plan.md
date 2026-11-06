# Plan de Implementación Técnica (`plan.md`)

- **Feature Branch:** `001-cbg-lead-system`
- **Spec Relacionada:** [spec.md](file:///c:/Users/gbfis/Documents/proyectosProgramacion/landing_page_cbg/specs/001-cbg-lead-system/spec.md)
- **Constitución:** [constitution.md](file:///c:/Users/gbfis/Documents/proyectosProgramacion/landing_page_cbg/.specify/memory/constitution.md)
- **Fecha:** 2026-11-05

---

## 1. Contexto Técnico y Stack Elegido

| Capa | Tecnología Elegida | Justificación para el Negocio |
| :--- | :--- | :--- |
| **Framework Fullstack** | **Next.js (App Router) + TypeScript** | Unifica la Landing Page pública (SSR/SEO ultra rápido para enlaces en redes sociales), el Portal de Webinar y el Panel de Administración Privado en un solo repositorio mantenible. |
| **Base de Datos** | **MySQL alojada en Railway** | Base de datos relacional robusta, económica y de aprovisionamiento inmediato en Railway. Ideal para relaciones estructuradas entre Leads, Etapas, Campañas de Redes, Roles y Equipos. |
| **ORM y Migraciones** | **Prisma ORM** (sobre MySQL) | Esquema declarativo (`schema.prisma`), tipado estricto de extremo a extremo en TypeScript y migraciones automáticas hacia Railway (`prisma migrate deploy`) + semilla de datos (`seed.ts`). |
| **Estilos y UI** | **Tailwind CSS + Lucide Icons** | Diseño *Mobile-First* de alto impacto visual con paleta ejecutiva (Azul Marino CBG/Globe Life + Dorado/Ámbar) y componentes táctiles rápidos para celular y escritorio. |
| **Autenticación y Roles (RBAC)** | **Auth.js (NextAuth) / JWT Session con Cookies HTTP-Only** | Control de acceso ligero y seguro directamente contra la tabla `users` en MySQL de Railway, diferenciando los permisos de `LEADER` (Luis Andrés), `ASSISTANT` (Asistente), `HR` (Recursos Humanos) y `AGENT` (Miembros del equipo). |
| **Reproductor y Rastreo de Webinar** | **YouTube IFrame Player API + HTML5 Video Fallback** | Permite incrustar el video grabado de presentación de negocio y capturar eventos exactos (`onStateChange`, porcentaje de tiempo visto: 25%, 50%, 80%, 100%) enviando *heartbeats* al backend en Next.js. |
| **Despliegue** | **Railway** (App + MySQL) o **Vercel + Railway MySQL** | Facilita tener tanto la base de datos MySQL como la aplicación Next.js corriendo en el ecosistema de Railway (o el frontend en Vercel conectado al MySQL de Railway). |

---

## 2. Verificación de Cumplimiento con la Constitución (`Constitution Check`)

1. **¿Cumple Artículo I (Máquina de Conversión y White-Label)?**
   - Sí. Se incluye una tabla/configuración `LeaderProfile` en MySQL para que el nombre de Luis Andrés Salazar, foto, WhatsApp, video del webinar y estados ITIN sean dinámicos y fácilmente replicables para futuros clientes de Carta Business Group.
2. **¿Cumple Artículo II (Mobile-First & High-Trust)?**
   - Sí. El Panel Operativo tendrá vista de **Tarjetas de Acción Rápida (Swipe/Tap)** en pantallas móviles (`< 768px`) con botones directos `tel:` y `https://wa.me/` y vista de **Tablero Kanban / Tabla Ejecutiva** en pantallas de escritorio (`>= 1024px`).
3. **¿Cumple Artículo III (Separación de Roles RBAC)?**
   - Sí. El middleware y los Server Components / API Routes de Next.js filtrarán las vistas y acciones según el rol del usuario autenticado (`LEADER`, `ASSISTANT`, `HR`).
4. **¿Cumple Artículo IV (Trazabilidad de Redes y Webinar)?**
   - Sí. Un middleware o hook de captura leerá `?src=` / `?utm_campaign=` al aterrizar en la landing, lo guardará en `sessionStorage`/`cookie` durante el Quiz y lo asociará al Lead en MySQL.

---

## 3. Arquitectura de Rutas y Módulos (Next.js App Router)

```text
src/
├── app/
│   ├── (public)/                     # Rutas públicas de alta conversión
│   │   ├── page.tsx                  # Landing Principal con Bifurcador (Carrera vs Protección) + Simulador
│   │   ├── carrera/page.tsx          # Ruta directa para Reels/TikToks de Reclutamiento de Agentes
│   │   ├── proteccion/page.tsx       # Ruta directa para campañas de Seguros / Protección Familiar
│   │   └── webinar/page.tsx          # Portal de Webinar Grabado (?lead=ID) con rastreo en tiempo real
│   ├── (auth)/
│   │   └── login/page.tsx            # Acceso seguro para Luis Andrés, Asistente y RRHH
│   ├── (dashboard)/                  # Panel Operativo Protegido por Rol (Mobile & Desktop)
│   │   ├── layout.tsx                # Navegación adaptativa según el Rol (Líder, Asistente, RRHH)
│   │   ├── dashboard/                # Vista General y Analíticas de Embudo (Solo LEADER)
│   │   ├── piscina/                  # Cola de Llamadas y Seguimiento de Webinar (ASSISTANT & LEADER)
│   │   ├── rrhh/                     # Bandeja de Entrevistas y Enrolamiento a Licencia (HR & LEADER)
│   │   ├── clientes/                 # Embudo de Clientes de Pólizas y Asignación al Equipo (LEADER)
│   │   ├── campanas/                 # Generador de Links para Redes Sociales y ROI por video (LEADER)
│   │   └── configuracion/            # Ajustes de Webinar, Estados ITIN, Plantillas WhatsApp y Usuarios (LEADER)
│   └── api/                          # Endpoints REST / Route Handlers conectados a MySQL
│       ├── auth/[...nextauth]/
│       ├── leads/                    # Creación desde el Quiz (con cálculo SSN/ITIN) y actualización de etapa
│       ├── webinar-tracking/         # Recepción de progreso del video (25%, 50%, 80%, 100%, solicitud entrevista)
│       ├── campaigns/                # Registro de clics y creación de links de redes sociales
│       └── settings/                 # Configuración de perfil del líder, plantillas y estados ITIN
├── components/
│   ├── landing/                      # Hero, Simulador de Ingresos/Residuales, Quiz Reclutamiento, Quiz Clientes
│   ├── webinar/                      # Reproductor con telemetría y CTA desbloqueable para entrevista RRHH
│   ├── crm/                          # Tarjetas de Lead (Mobile/Kanban), Disparador de WhatsApp 1-Clic, Checklist RRHH
│   └── analytics/                    # Gráficas de Embudo de Conversión y Tabla de Rendimiento de Redes Sociales
├── lib/
│   ├── prisma.ts                     # Cliente Singleton de Prisma conectado a Railway MySQL
│   ├── eligibility.ts                # Motor de reglas de negocio (SSN vs ITIN por Estado/Ciudad)
│   ├── whatsapp.ts                   # Motor de interpolación de plantillas de WhatsApp ({nombre}, {link_webinar})
│   └── auth.ts                       # Utilidades de sesión y verificación de permisos por rol
└── prisma/
    ├── schema.prisma                 # Esquema relacional en MySQL
    └── seed.ts                       # Datos iniciales de Luis Andrés Salazar, Usuarios demo, Plantillas y Estados ITIN
```

---

## 4. Diseño de los Motores Diferenciales

### 4.1. Motor de Pre-Calificación SSN / ITIN (`src/lib/eligibility.ts`)
Cuando un prospecto envía el Quiz de Reclutamiento:
1. Se evalúa el campo `documentStatus` (`SSN_WORK_PERMIT`, `ITIN`, `NONE`) y `state` / `city`.
2. Reglas de clasificación automática:
   - **`SSN_WORK_PERMIT`** + mentalidad comercial ➔ `qualification = 'QUALIFIED_HIGH'`, `stage = 'POOL'` (Entra a la Piscina de la Asistente con prioridad alta 🟢).
   - **`ITIN`** ➔ Se consulta la tabla `ItinJurisdiction` en MySQL.
     - Si el Estado/Ciudad está marcado como `ALLOWED`: `qualification = 'QUALIFIED_ITIN'`, `stage = 'POOL'` (Entra a la Piscina con insignia amarilla 🟡).
     - Si requiere verificación manual: `qualification = 'PENDING_ITIN_CHECK'`, `stage = 'POOL'` con alerta visual para la Asistente.
   - **`NONE`** ➔ `qualification = 'DISQUALIFIED_DOCS'`, `stage = 'DISQUALIFIED'` (Queda registrado para analíticas pero **oculto** de la Piscina de llamadas de la Asistente 🔴, ofreciendo en la vista pública el pase a Protección Familiar).

### 4.2. Telemetría del Portal de Webinar (`/webinar?lead=[id]`)
1. Al abrir la URL `/webinar?lead=xyz`, el servidor valida el ID del lead en MySQL, personaliza el título (*"Preparado para [Nombre]"*) y registra `webinarOpenedAt = NOW()`.
2. El reproductor escucha el progreso de reproducción y envía peticiones ligeras (`POST /api/webinar-tracking`) al alcanzar los hitos `25%`, `50%`, `80%` y `100%`, actualizando `webinarWatchPct` en la tabla `Lead`.
3. Al hacer clic en **"¡Ya vi el Webinar, solicitar entrevista con RRHH!"**, el estado del lead cambia automáticamente a `READY_FOR_HR` (o marca el flag `requestedHrInterview = true`) y genera una actividad en la bitácora del candidato.

### 4.3. Generador de Plantillas de WhatsApp a 1 Clic (`src/lib/whatsapp.ts`)
Permite que la Asistente, RRHH o Luis Andrés disparen mensajes sin escribir:
- Reemplaza variables dinámicas: `{{nombre}}`, `{{lider}}`, `{{link_webinar}}`, `{{estado}}`.
- Construye la URL universal `https://wa.me/1XXXXXXXXXX?text=...` compatible tanto con la App de WhatsApp en iOS/Android como con WhatsApp Web/Desktop en PC.
- Al hacer clic en el botón de WhatsApp dentro del CRM, simultáneamente guarda en MySQL un registro en `LeadActivity` (*"Asistente envió plantilla de Webinar por WhatsApp"*).

