/**
 * Core Domain Types for JUANET.cloud
 */

export type ServiceSlug =
  | 'web-development'
  | 'graphic-design'
  | 'branding'
  | 'business-software-automation'
  | 'school-management-systems'
  | 'ai-solutions'
  | 'mobile-app-development'
  | 'it-support'
  | 'hosting-domains-email'
  | 'digital-marketing-seo'
  | 'ecommerce'
  | 'custom-solutions';

export interface ServiceDeliverable {
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  slug: ServiceSlug;
  name: string;
  shortDescription: string;
  fullDescription: string;
  iconKey: string;
  category: string;
  headline: string;
  problemsSolved: string[];
  deliverables: ServiceDeliverable[];
  suitableUseCases: string[];
  processSteps: { title: string; description: string }[];
  faqs: FAQItem[];
  relatedServices: ServiceSlug[];
  isPublished: boolean;
  displayOrder: number;
}

export type PortfolioCategory =
  | 'Websites'
  | 'Web Applications'
  | 'Software & Automation'
  | 'Branding'
  | 'Graphic Design'
  | 'E-commerce'
  | 'AI Solutions'
  | 'Other';

export interface ProjectImage {
  id: string;
  projectId: string;
  storagePath: string;
  altText: string;
  caption?: string;
  displayOrder: number;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: PortfolioCategory;
  featuredImagePath?: string;
  technologies: string[];
  clientName?: string;
  clientVisibilityApproved?: boolean;
  externalUrl?: string;
  challenge?: string;
  approach?: string;
  outcomes?: string;
  isFeatured: boolean;
  publicationStatus: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  images?: ProjectImage[];
}

export type InquiryType = 'contact' | 'quotation' | 'consultation';

export type ContactPreference = 'email' | 'phone' | 'whatsapp';

export interface InquiryPayload {
  inquiryType: InquiryType;
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  country?: string;
  preferredContactMethod?: ContactPreference;
  
  // Specific to contact
  subject?: string;
  message?: string;

  // Specific to service quotation
  serviceSlug?: ServiceSlug | string;
  projectSummary?: string;
  projectDetails?: string;
  intendedAudience?: string;
  existingWebsiteUrl?: string;
  preferredTechnologies?: string;
  budgetRange?: string;
  preferredTimeline?: string;
  desiredStartDate?: string;
  additionalNotes?: string;

  // Specific to consultation
  consultationTopic?: string;
  consultationDescription?: string;
  preferredDate?: string;
  preferredTimeWindow?: string;
  timeZone?: string;

  // Compliance & spam protection
  privacyConsent: boolean;
  honeypot?: string; // Must be empty
}

export interface InquirySubmissionResult {
  success: boolean;
  referenceCode?: string;
  message: string;
  errors?: Record<string, string>;
}

export interface SiteSetting {
  id: string;
  settingKey: string;
  publicValue: Record<string, any>;
  updatedAt: string;
}
