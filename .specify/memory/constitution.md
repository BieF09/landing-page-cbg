# Constitución del Proyecto: Sistema de Captación, Filtrado y Gestión de Leads (CBG / Globe Life)

> **Metodología:** Spec-Driven Development (Spec Kit)  
> **Cliente Piloto:** Luis Andrés Salazar (Líder de Agencia en Carta Business Group / American Income Life - Globe Life)  
> **Visión Comercial:** Producto replicable (White-Label / Multi-Tenant Ready) para líderes comerciales de la red CBG.

---

## Artículo I: Propósito y Filosofía de Negocio

1. **No es un sitio informativo; es una máquina de conversión y filtrado:** Cada elemento visual o interactivo debe servir para (a) generar confianza institucional en la comunidad hispana de EE. UU., (b) capturar y pre-calificar prospectos (Agentes o Clientes), o (c) acelerar el flujo operativo entre la Piscina, la Asistente, el Webinar y Recursos Humanos.
2. **Protección del Tiempo Operativo:** El sistema jamás debe mezclar prospectos no calificados legalmente (sin SSN ni ITIN válido según jurisdicción) en la bandeja de llamadas prioritarias de la Asistente. El filtrado ocurre *antes* de consumir tiempo humano.
3. **Arquitectura "Plantilla Comercializable" (White-Label Ready):** Aunque la primera implementación está personalizada para **Luis Andrés Salazar**, ningún texto, enlace de video, regla de estados ITIN, plantilla de WhatsApp o dato de perfil debe estar rígidamente acoplado al código fuente sin posibilidad de configuración. Todo debe diseñarse pensando en replicar el sistema para sus compañeros de agencia en minutos.

---

## Artículo II: Experiencia de Usuario y Diseño (Mobile-First & High-Trust)

1. **Prioridad Absoluta al Dispositivo Móvil (Mobile-First):**
   - Más del 90% del tráfico proveniente de Instagram Reels y TikTok ingresará desde un teléfono inteligente.
   - Tanto la Landing Page (Quiz de aplicación, Simulador, Portal de Webinar) como el Panel Operativo (Piscina de Asistente, Bandeja de RRHH y Dashboard del Líder) deben operar con fluidez táctil, botones de acción al alcance del pulgar y disparo nativo hacia WhatsApp y Llamadas telefónicas.
   - En pantallas de escritorio (PC), el panel operativo debe aprovechar el espacio horizontal mediante vistas tipo tablero Kanban y tablas analíticas detalladas.
2. **Estética de Autoridad Financiera (High-Trust Corporate):**
   - El diseño debe alejarse radicalmente de esquemas informales o promesas de "dinero fácil".
   - La identidad visual debe proyectar solidez institucional, desarrollo empresarial y protección familiar (paleta Azul Marino Institucional, Dorado/Ámbar Ejecutivo, Blanco Puro y Grises Neutros), destacando el respaldo de **Carta Business Group** y **Globe Life / American Income Life** (70+ años de trayectoria).

---

## Artículo III: Separación Estricta de Roles y Responsabilidades (RBAC)

El sistema debe garantizar que cada actor del equipo interactúe únicamente con las herramientas y etapas que corresponden a su función:

1. **Superusuario / Líder Administrador (Luis Andrés Salazar):**
   - Visibilidad 360° de ambos embudos (Reclutamiento de Agentes y Clientes de Pólizas).
   - Acceso a analíticas de conversión por etapa, atribución de campañas de redes sociales, gestión de equipo (asignación de leads de clientes a agentes activos) y configuración global del sistema.
2. **Perfil Asistente (Telemercadeo y Primer Contacto):**
   - Acceso enfocado en la **Piscina de Leads Calificados** y la etapa de **Seguimiento de Webinar**.
   - Herramientas de velocidad: cola de llamadas diaria, envío de WhatsApp con enlace rastreable de Webinar a 1 clic, registro rápido de intentos de contacto y pase a entrevista. Sin permisos para eliminar leads ni alterar configuraciones globales.
3. **Perfil Recursos Humanos (Entrevista y Enrolamiento):**
   - Acceso exclusivo a candidatos que ya superaron el filtro inicial / visualización del Webinar y se encuentran en **Entrevista RRHH** o **Enrolamiento en Licencia (Pre-licensing)**.
   - Herramientas de evaluación de entrevista, validación documental y seguimiento hasta la obtención de la licencia estatal.

---

## Artículo IV: Trazabilidad de Marketing y Transparencia del Embudo

1. **Cero Puntos Ciegos en Redes Sociales:** Todo enlace compartido en redes sociales (Instagram, TikTok, Facebook, WhatsApp) debe poder generarse desde el panel con parámetros de atribución (`UTM / Source ID`) para medir no solo cuántos clics o registros generó una publicación, sino cuántos de esos prospectos llegaron realmente a **Ver el Webinar**, **Pasar RRHH** y **Enrolarse en la Licencia**.
2. **Rastreo Real del Webinar Grabado:** El video de presentación de negocio no se entrega como un enlace externo suelto sin control, sino a través de una página dedicada del propio sistema (`Portal de Webinar`) vinculada al ID del candidato, permitiendo conocer si abrió el enlace, su porcentaje de visualización y su confirmación para agendar entrevista con RRHH.

---

## Artículo V: Cumplimiento, Transparencia y Seguridad de Datos

1. **Transparencia en el Modelo 1099:** Las herramientas interactivas (como el Simulador de Ingresos y Residuales) deben incluir descargos de responsabilidad (*disclaimers*) claros indicando que los ingresos dependen exclusivamente del desempeño comercial bajo modalidad de contratista independiente (1099).
2. **Privacidad de Datos Sensibles:** En el Quiz de pre-calificación **nunca** se solicitará el número de Social Security (SSN) ni el número de ITIN en texto plano; únicamente se consultará la **tenencia/estatus** del documento (Ej. *"¿Cuentas con SSN y Permiso de Trabajo vigente, o ITIN?"*) para efectos de filtrado de elegibilidad.

