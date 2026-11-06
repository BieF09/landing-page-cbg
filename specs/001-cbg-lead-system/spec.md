# Especificación Funcional: Ecosistema de Captación, Filtrado y Gestión Operativa para Líderes CBG

- **Feature Branch:** `001-cbg-lead-system`
- **Creado:** 2026-11-05
- **Estado:** Borrador para Revisión (Spec Kit Fase 2)
- **Cliente Piloto:** Luis Andrés Salazar — Carta Business Group / Globe Life (American Income Life)

---

## 1. Resumen Ejecutivo

Construir un sistema integral compuesto por:
1. **Landing Page de Alta Conversión con Bifurcación Inteligente:** Posiciona la marca personal de **Luis Andrés Salazar** respaldada por **Carta Business Group / Globe Life**, captando principalmente **Candidatos a Agentes (Reclutamiento)** mediante un Quiz de Pre-Calificación (con validación de SSN/ITIN por jurisdicción) y un Simulador de Ingresos/Residuales, y secundariamente **Clientes de Pólizas (Protección Familiar)** para venta directa o asignación al equipo.
2. **Portal de Webinar con Rastreo de Visualización:** Página dedicada donde los candidatos ven el video grabado de presentación de negocio y el sistema detecta automáticamente quién abrió el enlace, cuánto vio y quién solicita su entrevista con RRHH.
3. **Sistema Operativo Multi-Rol (Mini-CRM Especializado):** Panel adaptable a móvil y escritorio con vistas e interfaces diferenciadas para **Líder Administrador (Luis Andrés)**, **Asistente (Primer Contacto)** y **Recursos Humanos (Entrevista y Enrolamiento en Licencia)**, integrado con plantillas de WhatsApp a 1 clic y rastreador de campañas de redes sociales.

---

## 2. Escenarios de Usuario y Pruebas (User Stories)

### Historia de Usuario 1 — Captación y Pre-Calificación Inteligente de Candidatos a Agente (Prioridad: P1)
Como visitante hispano en EE. UU. proveniente de una red social de Luis Andrés Salazar, quiero conocer la oportunidad de carrera en Carta Business Group / Globe Life, simular mi potencial de ingresos y completar una aplicación rápida e interactiva para saber si califico y recibir los siguientes pasos.

**Por qué esta prioridad:** Es el corazón de la entrada del embudo de liderazgo de Luis Andrés; sin captación filtrada, el resto del sistema no tiene datos con los que operar.

**Criterios de Aceptación:**
1. **Dado** que un visitante entra a la Landing Page (`/` o `/carrera`), **Cuando** visualiza la página en móvil o escritorio, **Entonces** ve claramente la propuesta de valor de formar parte del equipo de Luis Andrés Salazar en Carta Business Group / Globe Life, el Simulador Interactivo de Comisiones/Residuales y el botón para iniciar el Quiz de Aplicación.
2. **Dado** que el visitante inicia el Quiz de Reclutamiento, **Cuando** responde las preguntas paso a paso (Nombre, WhatsApp, Correo, Estado/Ciudad en EE. UU., Situación laboral actual, Disponibilidad remota, Mentalidad de ingresos por comisión 100% vs. sueldo fijo, y **Tenencia de Documentación: SSN + Permiso de Trabajo / ITIN / Ninguno**), **Entonces** el sistema calcula automáticamente su **Clasificación de Elegibilidad**:
   - **🟢 Calificado Prioridad Alta (SSN):** Tiene SSN y permiso de trabajo. Entra directo a la `Piscina Activa` de la Asistente.
   - **🟡 Calificado por ITIN:** Tiene ITIN y reside en un Estado/Ciudad habilitado para ITIN en la configuración del sistema (o queda marcado como "ITIN - Verificar Jurisdicción"). Entra a la `Piscina Activa` con etiqueta ITIN.
   - **🔴 No Elegible Temporalmente (Sin SSN ni ITIN):** Se registra en base de datos para historial/estadísticas bajo estado `No Califica (Documentación)`, **no contamina** la Piscina de llamadas de la Asistente, y en pantalla recibe un mensaje empático explicando el requisito regulatorio estatal e invitándolo a proteger a su familia como cliente.
3. **Dado** que un candidato **Calificado (🟢 o 🟡)** completa el Quiz, **Cuando** ve la pantalla de confirmación, **Entonces** visualiza un mensaje de bienvenida de Luis Andrés indicando que su Asistente lo contactará en breve para compartirle la Presentación Oficial de Negocio (Webinar), con un botón opcional para escribir por WhatsApp de inmediato.

---

### Historia de Usuario 2 — Gestión de "La Piscina" y Primer Contacto por la Asistente (Prioridad: P1)
Como **Asistente** de Luis Andrés, quiero entrar a mi panel desde el celular o la PC y ver únicamente la cola de candidatos calificados pendientes en la "Piscina", para llamarlos rápidamente, enviarles por WhatsApp el link rastreable del Webinar y registrar el resultado del contacto en segundos.

**Por qué esta prioridad:** Es el primer cuello de botella operativo. Si la asistente trabaja rápido y con guiones estandarizados, la tasa de visualización del webinar se multiplica.

**Criterios de Aceptación:**
1. **Dado** que la Asistente inicia sesión con su perfil, **Cuando** accede al sistema, **Entonces** ve exclusivamente las bandejas operativas de su competencia: `1. En Piscina (Por Contactar)` y `2. Contactado / Webinar Enviado` (con indicador de si ya vio el video).
2. **Dado** que la Asistente selecciona un candidato en `En Piscina`, **Cuando** presiona el botón de **"Llamar"** o **"Enviar WhatsApp + Webinar"**, **Entonces**:
   - El sistema abre la aplicación telefónica o WhatsApp con el mensaje pre-redactado personalizado con el nombre del candidato y su **enlace único de Webinar** (`/webinar?lead={id}`).
   - El candidato pasa a la etapa `Contactado / Webinar Enviado`, registrando automáticamente la fecha, hora y usuario que realizó la gestión, más un campo rápido para notas de la llamada (ej. *"Contestó, muy motivado, lo verá hoy en la noche"*).
3. **Dado** que un candidato no contesta la llamada, **Cuando** la Asistente marca `No Contestó (Intento 1/2/3)`, **Entonces** el lead permanece en seguimiento con una etiqueta visual del número de intentos y permite disparar una plantilla de WhatsApp de *"Te llamé de la oficina de Luis Andrés Salazar..."*.

---

### Historia de Usuario 3 — Portal de Webinar Grabado con Rastreo Automático (Prioridad: P1)
Como candidato que recibió el enlace del Webinar por parte de la Asistente, quiero ver el video de presentación de negocio en una página oficial de Luis Andrés Salazar y confirmar mi interés al terminar para pasar a entrevista con Recursos Humanos.

**Por qué esta prioridad:** Elimina la ceguera de enviar un video por redes/WhatsApp y no saber quién realmente tiene interés genuino antes de agendar a RRHH.

**Criterios de Aceptación:**
1. **Dado** que el candidato abre su enlace único `/webinar?lead={id}`, **Cuando** carga la página, **Entonces** el sistema registra automáticamente el evento `Abrió Enlace de Webinar` con fecha y hora y le muestra un saludo personalizado (*"Hola [Nombre], bienvenido a la presentación oficial de Carta Business Group con Luis Andrés Salazar"*).
2. **Dado** que el candidato reproduce el video grabado, **Cuando** avanza en la reproducción (25%, 50%, 80% / Completado), **Entonces** el sistema actualiza en tiempo real el porcentaje de visualización en la ficha del candidato.
3. **Dado** que el candidato supera el umbral de visualización del video (o finaliza), **Cuando** hace clic en el botón principal **"¡Vi la presentación y quiero mi entrevista con RRHH!"**, **Entonces** el candidato pasa automáticamente (o con prioridad destacada) a la etapa `Listo para Entrevista RRHH`, notificando en el panel a la Asistente y a Recursos Humanos.

---

### Historia de Usuario 4 — Entrevista de Selección y Enrolamiento por Recursos Humanos (Prioridad: P1)
Como encargado de **Recursos Humanos (RRHH)**, quiero ver una bandeja limpia con los candidatos que ya vieron el Webinar y están listos para entrevista, para evaluarlos, guiarlos en su inscripción al curso de licencia estatal (Pre-licensing) y marcarlos como enrolados.

**Por qué esta prioridad:** Es el cierre del embudo de reclutamiento donde el prospecto se convierte en un futuro agente productivo del equipo.

**Criterios de Aceptación:**
1. **Dado** que el usuario de RRHH inicia sesión, **Cuando** abre su panel, **Entonces** visualiza las etapas: `3. Listo para Entrevista RRHH`, `4. Entrevista Realizada / En Decisión`, `5. Enrolado en Licencia (Pre-licensing)` y `6. Agente Licenciado / Activo`.
2. **Dado** que RRHH abre la ficha de un candidato, **Cuando** realiza la entrevista, **Entonces** puede visualizar todo el historial previo (respuestas del Quiz, si tiene SSN o ITIN, cuánto vio del Webinar, notas de la Asistente) y completar el **Checklist de Entrevista RRHH** (Compromiso de horario, comprensión del esquema 1099 de comisiones, disposición para inversión de licencia, fecha objetivo de inicio).
3. **Dado** que el candidato aprueba la entrevista y se inscribe a estudiar la licencia, **Cuando** RRHH cambia su estado a `Enrolado en Licencia`, **Entonces** el sistema registra la conversión exitosa de reclutamiento e impacta las estadísticas de cierre del Líder.

---

### Historia de Usuario 5 — Embudo Secundario de Clientes de Pólizas y Asignación al Equipo (Prioridad: P2)
Como visitante interesado en proteger a mi familia en EE. UU. (y no en trabajar como agente), quiero solicitar una consulta gratuita de seguros/beneficios en la página de Luis Andrés; y como **Luis Andrés (Líder)**, quiero recibir ese lead y poder atenderlo yo mismo o asignárselo a un agente de mi equipo.

**Por qué esta prioridad:** Cumple el doble objetivo comercial y le da a Luis Andrés una herramienta de retención y liderazgo única: alimentar con clientes a los agentes de su propio equipo.

**Criterios de Aceptación:**
1. **Dado** que un visitante elige la opción *"Proteger a mi Familia / Cotizar Beneficios"* (o entra directamente por `/proteccion`), **Cuando** completa el formulario corto de protección familiar (Nombre, Teléfono, Estado, Núcleo familiar: Solo / Pareja / Hijos, Principal interés: Seguro de Vida / Accidentes / Salud Suplementaria / Protección de Ingresos), **Entonces** el lead entra al panel de Clientes bajo `Nuevo Cliente Potencial`.
2. **Dado** que Luis Andrés revisa un `Nuevo Cliente Potencial`, **Cuando** decide delegarlo a un miembro de su equipo, **Entonces** selecciona el nombre del agente de su equipo y hace clic en **"Asignar y Enviar por WhatsApp"**, lo que envía los datos del prospecto al agente seleccionado y deja constancia en el sistema de qué agente tiene asignado ese cliente y si logró cerrar la póliza.

---

### Historia de Usuario 6 — Dashboard de Superusuario, Estadísticas y Atribución de Redes Sociales (Prioridad: P2)
Como **Luis Andrés Salazar (Superusuario / Líder Administrador)**, quiero controlar todo el sistema, crear enlaces rastreables para mis publicaciones de Instagram/TikTok y ver estadísticas claras de conversión en cada etapa para saber qué campañas me traen más agentes licenciados y dónde se están quedando los prospectos.

**Por qué esta prioridad:** Convierte la herramienta en un sistema de inteligencia comercial que Luis Andrés podrá mostrar con orgullo y que servirá como demostración de venta para otros líderes de CBG.

**Criterios de Aceptación:**
1. **Dado** que Luis Andrés entra a su Dashboard de Líder, **Cuando** consulta las métricas (filtrables por rango de fechas y red social), **Entonces** visualiza:
   - Total de Leads captados (desglosado en Calificados SSN, Calificados ITIN, No Calificados y Clientes de Pólizas).
   - **Embudo de Conversión Paso a Paso (%):**
     `Piscina` ➔ `% Contactados por Asistente` ➔ `% Vieron Webinar` ➔ `% Entrevistados por RRHH` ➔ `% Enrolados en Licencia`.
   - **Rendimiento Operativo:** Velocidad/efectividad de contacto de la Asistente y tasa de cierre de RRHH.
2. **Dado** que Luis Andrés va a publicar un Reel en Instagram o un video en TikTok, **Cuando** usa el **"Generador de Links para Redes"** dentro de su panel (ej. Red: `Instagram`, Formato: `Reel`, Nombre: `Reel Inmigrantes Finanzas`, Destino: `Reclutamiento` o `Protección`), **Entonces** obtiene un link único listo para copiar y el sistema agrupa en una tabla comparativa cuántas visitas, registros, vistas de webinar y enrolamientos produjo exactamente esa publicación.
3. **Dado** que Luis Andrés accede a **Configuración del Sistema**, **Cuando** edita parámetros, **Entonces** puede actualizar el enlace/video del Webinar grabado, editar los estados/ciudades que aceptan ITIN, personalizar las plantillas de WhatsApp de cada etapa y gestionar los accesos de Asistente, RRHH y miembros de su equipo.

---

## 3. Casos Borde y Reglas de Negocio Especiales (Edge Cases)

1. **Duplicidad de Leads (Re-aplicación):** Si una misma persona (mismo teléfono o correo) vuelve a llenar el Quiz semanas después, el sistema no debe crear un registro duplicado huérfano, sino actualizar su registro existente o notificar que ya existe en el historial mostrando en qué etapa quedó anteriormente.
2. **Candidatos con ITIN en Jurisdicción Dudosa:** Si el candidato selecciona ITIN en un estado marcado como "Requiere Validación", entra a la Piscina con una alerta amarilla `⚠️ Verificar reglas de ITIN para [Estado/Ciudad]` para que la Asistente o RRHH lo valide antes de invertir tiempo extra.
3. **Reciclaje de Candidatos No Calificados a Clientes:** Cuando un candidato es descartado del embudo de Reclutamiento (porque no tiene SSN/ITIN o porque busca únicamente empleo fijo W-2), el sistema ofrece en la pantalla final un botón de 1 clic: *"Aunque hoy no apliques como agente, ¿te gustaría recibir información gratuita para proteger a tu familia en EE. UU.?"*, convirtiendo un descarte de reclutamiento en un posible cliente de póliza.

---

## 4. Criterios de Éxito Medibles (Success Criteria)

- **SC-001 (Velocidad de Pre-Calificación):** Un visitante desde el móvil puede completar el Quiz de aplicación en menos de **60 segundos**.
- **SC-002 (Ahorro Operativo):** **0%** de los leads sin documentación (ni SSN ni ITIN) aparecen mezclados por defecto en la bandeja activa de llamadas de la Asistente.
- **SC-003 (Velocidad de Gestión de la Asistente):** La Asistente puede contactar a un lead de la piscina, disparar el WhatsApp con su link único de Webinar y moverlo de etapa en **menos de 15 segundos** desde el celular o PC.
- **SC-004 (Replicabilidad Comercial):** Toda la identidad del líder (nombre, foto, biografía, teléfono, link de webinar, redes) está centralizada en una capa de configuración para que puedas desplegar el sistema a un compañero de Luis Andrés en menos de **30 minutos**.

