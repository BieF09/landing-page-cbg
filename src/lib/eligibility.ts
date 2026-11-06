import { DocumentStatus, QualificationStatus, LeadStage, ItinRuleStatus } from "@prisma/client";

export interface EligibilityInput {
  documentStatus: DocumentStatus;
  state: string;
  itinStateRule?: ItinRuleStatus | null;
}

export interface EligibilityResult {
  qualification: QualificationStatus;
  initialStage: LeadStage;
  badgeLabel: string;
  userMessage: string;
}

/**
 * Motor de Pre-Calificación SSN vs ITIN para proteger la Piscina de la Asistente.
 */
export function evaluateCandidateEligibility(input: EligibilityInput): EligibilityResult {
  if (input.documentStatus === "SSN_WORK_PERMIT") {
    return {
      qualification: "QUALIFIED_HIGH",
      initialStage: "POOL",
      badgeLabel: "🟢 Calificado Prioridad Alta (SSN + Permiso)",
      userMessage:
        "¡Excelente! Cumples con los requisitos regulatorios principales para tramitar tu licencia oficial y desarrollar tu carrera en EE. UU.",
    };
  }

  if (input.documentStatus === "ITIN") {
    if (input.itinStateRule === "NOT_ALLOWED") {
      return {
        qualification: "PENDING_ITIN_CHECK",
        initialStage: "POOL",
        badgeLabel: "🟡 ITIN — Requiere Revisión de Estado",
        userMessage:
          "Tu aplicación ha sido recibida. Nuestro equipo verificará las opciones disponibles con ITIN para tu jurisdicción.",
      };
    }

    if (input.itinStateRule === "ALLOWED") {
      return {
        qualification: "QUALIFIED_ITIN",
        initialStage: "POOL",
        badgeLabel: "🟡 Calificado vía Programa ITIN",
        userMessage:
          "¡Buenas noticias! Tu estado cuenta con opciones habilitadas para iniciar el proceso con ITIN válido.",
      };
    }

    return {
      qualification: "PENDING_ITIN_CHECK",
      initialStage: "POOL",
      badgeLabel: "🟡 ITIN — Validar Jurisdicción",
      userMessage:
        "Recibimos tus datos. La asistente de Luis Andrés validará la cobertura de licenciamiento con ITIN para tu ciudad.",
    };
  }

  // Sin SSN ni ITIN -> No entra a ensuciar la Piscina de llamadas de la Asistente
  return {
    qualification: "DISQUALIFIED_DOCS",
    initialStage: "DISCARDED",
    badgeLabel: "🔴 Sin Documentación Requerida (SSN/ITIN)",
    userMessage:
      "Por regulaciones estatales del Departamento de Seguros en EE. UU., para tramitar la licencia oficial de agente se requiere contar con Social Security Number (SSN) o ITIN válido. ¡Te invitamos a proteger a tu familia con nuestros planes o volver a aplicar en cuanto actualices tu estatus!",
  };
}

