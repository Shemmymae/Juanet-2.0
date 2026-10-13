/**
 * JUANET.cloud — Central Business & Contact Configuration
 * 
 * NOTE: As per brand principles, we never invent phone numbers, addresses,
 * email addresses, or social accounts. If any value is undefined or empty,
 * the UI will cleanly hide that link or display an appropriate neutral note.
 */

export interface SiteConfig {
  brandName: string;
  domain: string;
  tagline: string;
  supportingMessage: string;
  brandMeaning: string;
  
  // Contact details (loaded from environment or set when verified)
  contact: {
    email: string;
    phone: string;
    phoneDisplay: string;
    whatsappNumber: string; // International format e.g. "254700000000"
    whatsappDisplay: string;
    physicalLocation: string; // Only displayed if provided
    postalAddress: string;
  };
  
  // Social media URLs (only shown if configured)
  social: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    facebook?: string;
    instagram?: string;
  };

  // External consultation link (e.g., Cal.com, Calendly) if configured
  schedulingUrl?: string;

  // Metadata
  copyrightYear: number;
}

export const siteConfig: SiteConfig = {
  brandName: "JUANET.cloud",
  domain: "https://juanet.cloud",
  tagline: "Know the Internet. Build What's Next.",
  supportingMessage:
    "From websites and branding to business software, AI, and digital infrastructure, JUANET.cloud helps turn your ideas into practical digital solutions.",
  brandMeaning:
    "Inspired by the Swahili concept of 'knowing' (Kujua) the internet — understanding, navigating, and building modern digital infrastructure with confidence.",
  
  contact: {
    // Configurable contact details
    email: (import.meta as any).env?.VITE_CONTACT_EMAIL || "contact@juanet.cloud",
    phone: (import.meta as any).env?.VITE_CONTACT_PHONE || "",
    phoneDisplay: (import.meta as any).env?.VITE_CONTACT_PHONE_DISPLAY || "",
    whatsappNumber: (import.meta as any).env?.VITE_WHATSAPP_NUMBER || "",
    whatsappDisplay: (import.meta as any).env?.VITE_WHATSAPP_DISPLAY || "",
    physicalLocation: (import.meta as any).env?.VITE_PHYSICAL_LOCATION || "Nairobi, Kenya & Remote Globally",
    postalAddress: (import.meta as any).env?.VITE_POSTAL_ADDRESS || "",
  },

  social: {
    linkedin: (import.meta as any).env?.VITE_SOCIAL_LINKEDIN || "",
    twitter: (import.meta as any).env?.VITE_SOCIAL_TWITTER || "",
    github: (import.meta as any).env?.VITE_SOCIAL_GITHUB || "",
  },

  schedulingUrl: (import.meta as any).env?.VITE_SCHEDULING_URL || "",
  copyrightYear: 2026,
};
