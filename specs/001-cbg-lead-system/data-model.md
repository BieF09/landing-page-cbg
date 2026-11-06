# Modelo de Datos en MySQL (`data-model.md`)

- **Motor de Base de Datos:** MySQL 8.x (Alojado en **Railway**)
- **ORM:** Prisma (`prisma/schema.prisma`)
- **Enfoque:** Preparado para Multi-Líder (`LeaderProfile`) para facilitar la venta del sistema a compañeros de Luis Andrés Salazar en Carta Business Group.

---

## 1. Diagrama Entidad-Relación (Mermaid)

```mermaid
erDiagram
    LeaderProfile ||--o{ User : "tiene equipo y operadores"
    LeaderProfile ||--o{ Campaign : "crea links de redes"
    LeaderProfile ||--o{ Lead : "capta prospectos"
    LeaderProfile ||--o{ WhatsappTemplate : "configura mensajes"
    LeaderProfile ||--o{ ItinJurisdiction : "define reglas ITIN"

    Campaign ||--o{ Lead : "atribuye origen"
    User ||--o{ Lead : "asignado a (Agente/Asistente/RRHH)"
    Lead ||--o{ LeadActivity : "registra bitacora"

    LeaderProfile {
        string id PK
        string slug UK "ej: luis-andres-salazar"
        string fullName "Luis Andres Salazar"
        string agencyName "Carta Business Group | Globe Life"
        string whatsappNumber
        string webinarVideoUrl "URL de YouTube/Vimeo/MP4"
        string heroHeadline
        datetime createdAt
    }

    User {
        string id PK
        string leaderId FK
        string name
        string email UK
        string passwordHash
        string phone
        enum role "LEADER | ASSISTANT | HR | AGENT"
        boolean isActive
    }

    Campaign {
        string id PK
        string leaderId FK
        string code UK "ej: ig-reel-inmigrantes-01"
        string name "Reel Finanzas Inmigrantes"
        enum platform "INSTAGRAM | TIKTOK | FACEBOOK | WHATSAPP | OTHER"
        enum targetFunnel "RECRUITMENT | CLIENT"
        int clicksCount
        datetime createdAt
    }

    Lead {
        string id PK
        string leaderId FK
        string campaignId FK "Nullable si fue tráfico directo"
        enum leadType "RECRUITMENT | CLIENT"
        string firstName
        string lastName
        string phone
        string email
        string state "Estado en EE.UU."
        string city "Ciudad en EE.UU."
        enum documentStatus "SSN_WORK_PERMIT | ITIN | NONE | NOT_APPLICABLE"
        enum qualification "QUALIFIED_HIGH | QUALIFIED_ITIN | PENDING_ITIN_CHECK | DISQUALIFIED_DOCS | CLIENT_LEAD"
        enum stage "POOL | CONTACTED_WEBINAR_SENT | WEBINAR_WATCHED | READY_FOR_HR | HR_INTERVIEWED | ENROLLED_LICENSING | ACTIVE_AGENT | CLIENT_NEW | CLIENT_ASSIGNED | CLIENT_CLOSED | DISCARDED"
        int callAttempts "Contador de llamadas de Asistente"
        datetime webinarOpenedAt
        int webinarWatchPct "0 a 100%"
        boolean requestedHrInterview
        json quizAnswers "Respuestas completas del Quiz (Reclutamiento o Póliza)"
        json hrChecklist "Evaluación de entrevista de RRHH"
        string assignedAgentId FK "Para leads de Clientes asignados a un agente del equipo"
        string notes "Nota rápida fijada"
        datetime createdAt
        datetime updatedAt
    }

    LeadActivity {
        string id PK
        string leadId FK
        string userId FK "Quién ejecutó la acción (Asistente, RRHH, Líder o Sistema)"
        enum actionType "CREATED | CALL_ATTEMPT | WHATSAPP_SENT | STAGE_CHANGE | WEBINAR_PROGRESS | HR_NOTE | ASSIGNED_TO_AGENT"
        string description
        datetime createdAt
    }

    WhatsappTemplate {
        string id PK
        string leaderId FK
        string name "Ej: Primer Contacto + Link Webinar"
        enum targetRole "ASSISTANT | HR | LEADER"
        enum triggerStage "POOL | CONTACTED_WEBINAR_SENT | READY_FOR_HR | CLIENT_NEW"
        text body "Hola {{nombre}}, te saluda la oficina de {{lider}}..."
    }

    ItinJurisdiction {
        string id PK
        string leaderId FK
        string stateCode "Ej: FL, TX, NY, CA"
        string stateName "Ej: Florida"
        string cityNotes "Ej: Permitido en todo el estado o ciudades específicas"
        enum status "ALLOWED | REQUIRES_CHECK | NOT_ALLOWED"
    }
```

---

## 2. Detalle de los Estados del Embudo (`Lead.stage`)

### A. Embudo de Reclutamiento de Agentes (`leadType = 'RECRUITMENT'`)
1. **`POOL` (En Piscina):** Estado inicial para candidatos calificados (`QUALIFIED_HIGH` o `QUALIFIED_ITIN`). Visible inmediatamente en la cola prioritaria de la **Asistente**.
2. **`CONTACTED_WEBINAR_SENT` (Contactado / Webinar Enviado):** La Asistente ya se comunicó y le compartió su link único de Webinar (`/webinar?lead={id}`).
3. **`WEBINAR_WATCHED` / `READY_FOR_HR` (Vio Webinar / Listo para RRHH):** Se activa automáticamente cuando el candidato supera el umbral del video o presiona el botón de solicitar entrevista en el Portal de Webinar (o cuando la Asistente lo promueve manualmente). Entra a la bandeja de **Recursos Humanos**.
4. **`HR_INTERVIEWED` (Entrevistado por RRHH):** RRHH realizó la entrevista de selección y llenó el checklist de evaluación.
5. **`ENROLLED_LICENSING` (Enrolado en Licencia - Pre-licensing):** ¡Hito clave de conversión! El candidato se inscribió oficialmente para estudiar y presentar el examen estatal de corredor de seguros.
6. **`ACTIVE_AGENT` (Agente Activo en el Equipo):** Aprobó la licencia y ya forma parte del equipo productivo de Luis Andrés.
7. **`DISCARDED` (Descartado / No Califica):** Incluye tanto a los que el sistema filtró automáticamente por falta de SSN/ITIN (`qualification = 'DISQUALIFIED_DOCS'`) como a los descartados manualmente por la Asistente o RRHH.

### B. Embudo de Clientes de Pólizas (`leadType = 'CLIENT'`)
1. **`CLIENT_NEW` (Nuevo Cliente Potencial):** Familia o individuo que solicitó cotización/asesoría de protección familiar (o reciclado desde el embudo de reclutamiento).
2. **`CLIENT_ASSIGNED` (Asignado a Agente del Equipo):** Luis Andrés se lo asignó a sí mismo o a un agente de su equipo (`assignedAgentId`) mediante el botón de envío por WhatsApp.
3. **`CLIENT_CLOSED` (Póliza Emitida / Cerrado):** Venta concretada.

