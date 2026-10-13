// Supabase Edge Function: submit-inquiry
// Phase 1 Public Submission Gateway for JUANET.cloud

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// -----------------------------------------------------------------------------
// CORS Configuration
// Restrict access to official domain and local/preview development environments
// -----------------------------------------------------------------------------
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/(www\.)?juanet\.cloud$/,
  /^http:\/\/localhost:(3000|5173)$/,
  /^https:\/\/.*\.run\.app$/,
];

function getCorsHeaders(originHeader: string | null): Record<string, string> {
  const origin = originHeader || '';
  const isAllowed = ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
  const resolvedOrigin = isAllowed ? origin : 'https://juanet.cloud';

  return {
    'Access-Control-Allow-Origin': resolvedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

// -----------------------------------------------------------------------------
// In-Memory Rate Limiting (Single-Isolate Burst Defense)
// NOTE: In serverless environments, in-memory Maps are ephemeral to the active
// V8 isolate. They mitigate rapid burst abuse on warm containers but do not
// synchronize across global edge regions or cold starts.
// -----------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const now = Date.now();

    // 1. IP Rate Limiting (Burst mitigation: max 10 requests per 10 minutes)
    const rateRecord = rateLimitMap.get(clientIp);
    if (rateRecord && rateRecord.expiresAt > now) {
      if (rateRecord.count >= 10) {
        return new Response(
          JSON.stringify({ error: 'Too many submissions. Please wait a few minutes before trying again.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      rateRecord.count++;
    } else {
      rateLimitMap.set(clientIp, { count: 1, expiresAt: now + 10 * 60 * 1000 });
    }

    // 2. Request body size check (64KB payload cap)
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 65536) {
      return new Response(
        JSON.stringify({ error: 'Payload too large.' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = await req.json();

    // 3. Honeypot check (Bots fill hidden fields)
    if (payload.honeypot && String(payload.honeypot).trim().length > 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid submission.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Validate mandatory fields
    const fullName = typeof payload.fullName === 'string' ? payload.fullName.trim() : '';
    const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
    const privacyConsent = payload.privacyConsent === true;
    const inquiryType = payload.inquiryType || 'contact';

    if (!['contact', 'quotation', 'consultation'].includes(inquiryType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid inquiry type specified.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (fullName.length < 2 || fullName.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid full name (2–100 characters).' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!email || email.length > 255 || !emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!privacyConsent) {
      return new Response(
        JSON.stringify({ error: 'Privacy consent is required to process your inquiry.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Connect to Supabase using server-side service role key (trusted backend only)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[submit-inquiry] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in Edge environment.');
      return new Response(
        JSON.stringify({ error: 'Server configuration error.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 6. Generate cryptographic reference code if not provided
    const year = new Date().getFullYear();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    const refCode = payload.referenceCode || `JN-${inquiryType.substring(0, 3).toUpperCase()}-${year}-${rand}`;

    // 7. Sanitize inputs and insert into inquiries table
    const serviceId = typeof payload.serviceSlug === 'string' ? payload.serviceSlug.slice(0, 100) : null;
    const projectSummary = typeof payload.projectSummary === 'string' ? payload.projectSummary.slice(0, 500) : null;
    const projectDetails = typeof (payload.projectDetails || payload.message) === 'string'
      ? String(payload.projectDetails || payload.message).slice(0, 5000)
      : null;

    const { error: dbError } = await supabase.from('inquiries').insert([
      {
        reference_code: refCode,
        inquiry_type: inquiryType,
        full_name: fullName,
        email: email,
        phone: typeof payload.phone === 'string' ? payload.phone.slice(0, 50) : null,
        organization: typeof payload.organization === 'string' ? payload.organization.slice(0, 150) : null,
        country: typeof payload.country === 'string' ? payload.country.slice(0, 100) : null,
        preferred_contact_method: ['email', 'phone', 'whatsapp'].includes(payload.preferredContactMethod)
          ? payload.preferredContactMethod
          : null,
        subject: typeof payload.subject === 'string' ? payload.subject.slice(0, 200) : null,
        service_id: serviceId,
        project_summary: projectSummary,
        project_details: projectDetails,
        project_url: typeof payload.existingWebsiteUrl === 'string' ? payload.existingWebsiteUrl.slice(0, 255) : null,
        budget_range: typeof payload.budgetRange === 'string' ? payload.budgetRange.slice(0, 100) : null,
        preferred_timeline: typeof payload.preferredTimeline === 'string' ? payload.preferredTimeline.slice(0, 100) : null,
        preferred_start_date: typeof payload.desiredStartDate === 'string' ? payload.desiredStartDate.slice(0, 50) : null,
        consultation_date: typeof payload.preferredDate === 'string' ? payload.preferredDate.slice(0, 50) : null,
        consultation_time_window: typeof payload.preferredTimeWindow === 'string' ? payload.preferredTimeWindow.slice(0, 100) : null,
        timezone: typeof payload.timeZone === 'string' ? payload.timeZone.slice(0, 100) : null,
        privacy_consent: true,
        consent_recorded_at: new Date().toISOString(),
        status: 'new',
        project_metadata: {
          clientIp: clientIp,
          serviceSlug: serviceId,
          intendedAudience: payload.intendedAudience ? String(payload.intendedAudience).slice(0, 200) : undefined,
          consultationTopic: payload.consultationTopic ? String(payload.consultationTopic).slice(0, 200) : undefined,
          viaGateway: 'edge_function',
        },
      },
    ]);

    if (dbError) {
      console.error('[submit-inquiry] Supabase insert error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Database storage failure: ' + dbError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, referenceCode: refCode }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[submit-inquiry] Unexpected exception:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
