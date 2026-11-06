export interface WhatsappInterpolationData {
  nombre: string;
  lider: string;
  estado: string;
  link_webinar: string;
}

/**
 * Reemplaza variables dinámicas en una plantilla y genera el enlace wa.me universal.
 */
export function buildWhatsappLink(
  phone: string,
  templateBody: string,
  data: WhatsappInterpolationData
): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const normalizedPhone = cleanPhone.startsWith("1") || cleanPhone.length > 10 ? cleanPhone : `1${cleanPhone}`;

  const message = templateBody
    .replace(/\{\{nombre\}\}/g, data.nombre)
    .replace(/\{\{lider\}\}/g, data.lider)
    .replace(/\{\{estado\}\}/g, data.estado)
    .replace(/\{\{link_webinar\}\}/g, data.link_webinar);

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}

