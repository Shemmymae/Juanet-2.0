import { InquiryPayload } from '../../types';

/**
 * Generate a unique, readable reference code for client inquiries
 * Format: JN-YYYY-XXXX (e.g. JN-2026-A4B7)
 */
export function generateReferenceCode(type: string = 'INQ'): string {
  const year = new Date().getFullYear();
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  const typeCode = type.substring(0, 3).toUpperCase();
  return `JN-${typeCode}-${year}-${randomChars}`;
}

/**
 * Build standard WhatsApp wa.me link with encoded message
 */
export function generateWhatsAppLink(rawPhone: string, message: string): string {
  if (!rawPhone) return '';
  // Clean phone number to digits only
  const cleanPhone = rawPhone.replace(/\D/g, '');
  if (!cleanPhone) return '';
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Format a human-readable summary for a service quotation to share via WhatsApp
 */
export function buildWhatsAppProjectSummary(payload: InquiryPayload, refCode?: string): string {
  const parts: string[] = [
    `*JUANET.cloud Service Inquiry*`,
    refCode ? `Ref Code: ${refCode}` : '',
    `--------------------------`,
    `*Name:* ${payload.fullName}`,
    `*Email:* ${payload.email}`,
    payload.phone ? `*Phone:* ${payload.phone}` : '',
    payload.organization ? `*Organization:* ${payload.organization}` : '',
    payload.serviceSlug ? `*Service:* ${payload.serviceSlug}` : '',
    payload.projectSummary ? `*Project Summary:* ${payload.projectSummary}` : '',
    payload.budgetRange ? `*Budget Range:* ${payload.budgetRange}` : '',
    payload.preferredTimeline ? `*Timeline:* ${payload.preferredTimeline}` : '',
    payload.projectDetails ? `\n*Details:*\n${payload.projectDetails}` : '',
  ].filter(Boolean);

  return parts.join('\n');
}

/**
 * Format ISO date string into readable English
 */
export function formatDate(isoString?: string): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  } catch {
    return isoString;
  }
}
