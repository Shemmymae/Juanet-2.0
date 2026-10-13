import { supabase, isSupabaseConfigured } from './client';
import { servicesData } from '../../data/servicesData';
import { initialPortfolioProjects } from '../../data/portfolioData';
import {
  Service,
  ServiceSlug,
  PortfolioProject,
  InquiryPayload,
  InquirySubmissionResult,
} from '../../types';
import { generateReferenceCode } from '../utils/format';

/**
 * Fetch all published services
 */
export async function getServices(): Promise<Service[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          slug: item.slug as ServiceSlug,
          name: item.name,
          headline: item.headline || item.name,
          category: item.category,
          iconKey: item.icon_key,
          shortDescription: item.short_description,
          fullDescription: item.full_description,
          problemsSolved: item.problems_solved || [],
          deliverables: item.deliverables || [],
          suitableUseCases: item.suitable_use_cases || [],
          processSteps: item.process_steps || [],
          faqs: item.faqs || [],
          relatedServices: item.related_services || [],
          isPublished: item.is_published,
          displayOrder: item.display_order,
        }));
      }
    } catch (err) {
      console.warn('[JUANET.cloud] Error querying Supabase services, using local catalog:', err);
    }
  }

  // Fallback to verified local services catalog
  return servicesData;
}

/**
 * Fetch a single service by slug
 */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const allServices = await getServices();
  const match = allServices.find((s) => s.slug === slug);
  return match || null;
}

/**
 * Fetch published portfolio projects
 */
export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*, images:portfolio_project_images(*)')
        .eq('publication_status', 'published')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          summary: p.summary,
          description: p.description,
          category: p.category,
          featuredImagePath: p.featured_image_path,
          technologies: p.technologies || [],
          clientName: p.client_visibility_approved ? p.client_name : undefined,
          clientVisibilityApproved: p.client_visibility_approved,
          externalUrl: p.external_url,
          challenge: p.challenge,
          approach: p.approach,
          outcomes: p.outcomes,
          isFeatured: p.is_featured,
          publicationStatus: p.publication_status,
          publishedAt: p.published_at,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
          images: (p.images || []).sort((a: any, b: any) => a.display_order - b.display_order),
        }));
      }
    } catch (err) {
      console.warn('[JUANET.cloud] Error querying portfolio projects from Supabase:', err);
    }
  }

  return initialPortfolioProjects;
}

/**
 * Fetch a single published project by slug
 */
export async function getPortfolioProjectBySlug(slug: string): Promise<PortfolioProject | null> {
  const projects = await getPortfolioProjects();
  const match = projects.find((p) => p.slug === slug);
  return match || null;
}

/**
 * Submit an inquiry (contact, service quote, or consultation)
 */
export async function submitInquiry(payload: InquiryPayload): Promise<InquirySubmissionResult> {
  // 1. Anti-spam honeypot verification
  if (payload.honeypot && payload.honeypot.trim().length > 0) {
    return {
      success: false,
      message: 'Invalid submission detected.',
    };
  }

  // 2. Validate mandatory fields
  if (!payload.fullName.trim() || !payload.email.trim()) {
    return {
      success: false,
      message: 'Please provide both your name and a valid email address.',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.email.trim())) {
    return {
      success: false,
      message: 'Please provide a valid email format (e.g. name@example.com).',
    };
  }

  if (!payload.privacyConsent) {
    return {
      success: false,
      message: 'Please confirm that you agree to our privacy policy to proceed.',
    };
  }

  // 3. Generate reference code
  const referenceCode = generateReferenceCode(payload.inquiryType);

  // 4. If Supabase is configured, insert into inquiries table
  if (isSupabaseConfigured && supabase) {
    try {
      const record = {
        reference_code: referenceCode,
        inquiry_type: payload.inquiryType,
        full_name: payload.fullName.trim(),
        email: payload.email.trim().toLowerCase(),
        phone: payload.phone?.trim() || null,
        organization: payload.organization?.trim() || null,
        country: payload.country?.trim() || null,
        preferred_contact_method: payload.preferredContactMethod || null,
        subject: payload.subject?.trim() || null,
        project_summary: payload.projectSummary?.trim() || null,
        project_details: payload.projectDetails?.trim() || payload.message?.trim() || null,
        project_url: payload.existingWebsiteUrl?.trim() || null,
        budget_range: payload.budgetRange || null,
        preferred_timeline: payload.preferredTimeline || null,
        preferred_start_date: payload.desiredStartDate || null,
        consultation_date: payload.preferredDate || null,
        consultation_time_window: payload.preferredTimeWindow || null,
        timezone: payload.timeZone || null,
        privacy_consent: true,
        consent_recorded_at: new Date().toISOString(),
        status: 'new',
        project_metadata: {
          serviceSlug: payload.serviceSlug,
          intendedAudience: payload.intendedAudience,
          preferredTechnologies: payload.preferredTechnologies,
          consultationTopic: payload.consultationTopic,
          consultationDescription: payload.consultationDescription,
        },
      };

      const { error } = await supabase.from('inquiries').insert([record]);

      if (error) {
        console.error('[JUANET.cloud] Database insert error:', error);
        return {
          success: false,
          referenceCode,
          message: `Database submission failed: ${error.message}. Please reach out directly or try again.`,
        };
      }

      return {
        success: true,
        referenceCode,
        message: 'Your inquiry has been successfully received. We will review your details and respond promptly.',
      };
    } catch (err: any) {
      console.error('[JUANET.cloud] Unexpected submission error:', err);
      return {
        success: false,
        referenceCode,
        message: `An unexpected error occurred: ${err.message || 'Please contact us directly.'}`,
      };
    }
  }

  // 5. If Supabase is not yet configured (e.g. local preview or fresh deployment before DB keys)
  // Store temporarily in sessionStorage for testing resilience
  try {
    const existing = JSON.parse(sessionStorage.getItem('juanet_offline_inquiries') || '[]');
    existing.push({
      ...payload,
      referenceCode,
      createdAt: new Date().toISOString(),
    });
    sessionStorage.setItem('juanet_offline_inquiries', JSON.stringify(existing));
  } catch {
    // ignore sessionStorage limits
  }

  return {
    success: true,
    referenceCode,
    message:
      'Inquiry processed successfully in preview mode. To persist inquiries permanently in production, configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
  };
}
