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
// Structured Logging Types & Helpers
// Emits single-line JSON records formatted for cloud ingest and log parsers.
// PII PROTECTION: Never log full names, email addresses, phone numbers,
// request bodies, session tokens, or service-role keys.
// -----------------------------------------------------------------------------
interface LogContext {
  timestamp: string;
  service: string;
  requestId: string;
  event:
    | 'request_received'
    | 'method_not_allowed'
    | 'rate_limit_rejected'
    | 'payload_too_large'
    | 'validation_rejected'
    | 'config_error'
    | 'database_error'
    | 'inquiry_created'
    | 'unexpected_error';
  outcome: 'received' | 'accepted' | 'rejected' | 'rate_limited' | 'error' | 'success';
  httpStatus: number;
  elapsedMs: number;
  inquiryType?: string;
  referenceCode?: string;
  reason?: string;
  errorCode?: string;
  errorName?: string;
}

function logStructured(
  level: 'info' | 'warn' | 'error',
  data: Omit<LogContext, 'timestamp' | 'service'>
): void {
  const entry: LogContext = {
    timestamp: new Date().toISOString(),
    service: 'juanet-edge-inquiry',
    ...data,
  };
  const json = JSON.stringify(entry);
  if (level === 'error') {
    console.error(json);
  } else if (level === 'warn') {
    console.warn(json);
  } else {
    console.info(json);
  }
}

function getElapsedMs(startTime: number): number {
  return Math.round((performance.now() - startTime) * 100) / 100;
}

// -----------------------------------------------------------------------------
// In-Memory Rate Limiting (Single-Isolate Burst Defense)
// NOTE: In serverless environments, in-memory Maps are ephemeral to the active
// V8 isolate. They mitigate rapid burst abuse on warm containers but do not
// synchronize across global edge regions or cold starts.
// -----------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

serve(async (req) => {
  const startTime = performance.now();
  const requestId = crypto.randomUUID();

  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // 1. Structured log for request receipt
  logStructured('info', {
    requestId,
    event: 'request_received',
    outcome: 'received',
    httpStatus: 200,
    elapsedMs: getElapsedMs(startTime),
  });

  // Only allow POST
  if (req.method !== 'POST') {
    logStructured('warn', {
      requestId,
      event: 'method_not_allowed',
      outcome: 'rejected',
      httpStatus: 405,
      elapsedMs: getElapsedMs(startTime),
      reason: `Unsupported HTTP method: ${req.method}`,
    });
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const now = Date.now();

    // 2. IP Rate Limiting (Burst mitigation: max 10 requests per 10 minutes)
    const rateRecord = rateLimitMap.get(clientIp);
    if (rateRecord && rateRecord.expiresAt > now) {
      if (rateRecord.count >= 10) {
        logStructured('warn', {
          requestId,
          event: 'rate_limit_rejected',
          outcome: 'rate_limited',
          httpStatus: 429,
          elapsedMs: getElapsedMs(startTime),
          reason: 'Rate limit threshold exceeded for client window',
        });
        return new Response(
          JSON.stringify({ error: 'Too many submissions. Please wait a few minutes before trying again.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      rateRecord.count++;
    } else {
      rateLimitMap.set(clientIp, { count: 1, expiresAt: now + 10 * 60 * 1000 });
    }

    // 3. Request body size check (64KB payload cap)
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 65536) {
      logStructured('warn', {
        requestId,
        event: 'payload_too_large',
        outcome: 'rejected',
        httpStatus: 413,
        elapsedMs: getElapsedMs(startTime),
        reason: 'Payload exceeded 64KB limit',
      });
      return new Response(
        JSON.stringify({ error: 'Payload too large.' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Safe payload parse
    let payload: any;
    try {
      payload = await req.json();
    } catch (_parseErr) {
      logStructured('warn', {
        requestId,
        event: 'validation_rejected',
        outcome: 'rejected',
        httpStatus: 400,
        elapsedMs: getElapsedMs(startTime),
        reason: 'Malformed JSON payload',
      });
      return new Response(
        JSON.stringify({ error: 'Invalid JSON request format.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Honeypot check (Bots fill hidden fields)
    if (payload.honeypot && String(payload.honeypot).trim().length > 0) {
      logStructured('warn', {
        requestId,
        event: 'validation_rejected',
        outcome: 'rejected',
        httpStatus: 400,
        elapsedMs: getElapsedMs(startTime),
        reason: 'Honeypot field triggered',
      });
      return new Response(
        JSON.stringify({ error: 'Invalid submission.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Validate mandatory fields
    const inquiryTypeRaw = typeof payload.inquiryType === 'string' ? payload.inquiryType.trim() : '';
    const validInquiryType = ['contact', 'quotation', 'consultation'].includes(inquiryTypeRaw)
      ? inquiryTypeRaw
      : null;

    if (!validInquiryType) {
      logStructured('warn', {
        requestId,
        event: 'validation_rejected',
        outcome: 'rejected',
        httpStatus: 400,
        elapsedMs: getElapsedMs(startTime),
        reason: 'Invalid or missing inquiry type',
      });
      return new Response(
        JSON.stringify({ error: 'Invalid inquiry type specified.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const fullName = typeof payload.fullName === 'string' ? payload.fullName.trim() : '';
    if (fullName.length < 2 || fullName.length > 100) {
      logStructured('warn', {
        requestId,
        event: 'validation_rejected',
        outcome: 'rejected',
        httpStatus: 400,
        elapsedMs: getElapsedMs(startTime),
        inquiryType: validInquiryType,
        reason: 'Full name failed length validation (2-100 characters)',
      });
      return new Response(
        JSON.stringify({ error: 'Please provide a valid full name (2–100 characters).' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!email || email.length > 255 || !emailRegex.test(email)) {
      logStructured('warn', {
        requestId,
        event: 'validation_rejected',
        outcome: 'rejected',
        httpStatus: 400,
        elapsedMs: getElapsedMs(startTime),
        inquiryType: validInquiryType,
        reason: 'Email format or length validation failed',
      });
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const privacyConsent = payload.privacyConsent === true;
    if (!privacyConsent) {
      logStructured('warn', {
        requestId,
        event: 'validation_rejected',
        outcome: 'rejected',
        httpStatus: 400,
        elapsedMs: getElapsedMs(startTime),
        inquiryType: validInquiryType,
        reason: 'Privacy policy consent not granted',
      });
      return new Response(
        JSON.stringify({ error: 'Privacy consent is required to process your inquiry.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 6. Connect to Supabase using server-side service role key (trusted backend only)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      logStructured('error', {
        requestId,
        event: 'config_error',
        outcome: 'error',
        httpStatus: 500,
        elapsedMs: getElapsedMs(startTime),
        inquiryType: validInquiryType,
        reason: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment',
      });
      return new Response(
        JSON.stringify({ error: 'Server configuration error.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 7. Generate cryptographic reference code if not provided
    const year = new Date().getFullYear();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    const refCode = payload.referenceCode || `JN-${validInquiryType.substring(0, 3).toUpperCase()}-${year}-${rand}`;

    // 8. Sanitize inputs and insert into inquiries table
    const serviceId = typeof payload.serviceSlug === 'string' ? payload.serviceSlug.slice(0, 100) : null;
    const projectSummary = typeof payload.projectSummary === 'string' ? payload.projectSummary.slice(0, 500) : null;
    const projectDetails = typeof (payload.projectDetails || payload.message) === 'string'
      ? String(payload.projectDetails || payload.message).slice(0, 5000)
      : null;

    const { error: dbError } = await supabase.from('inquiries').insert([
      {
        reference_code: refCode,
        inquiry_type: validInquiryType,
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
      logStructured('error', {
        requestId,
        event: 'database_error',
        outcome: 'error',
        httpStatus: 500,
        elapsedMs: getElapsedMs(startTime),
        inquiryType: validInquiryType,
        referenceCode: refCode,
        errorCode: dbError.code || 'DB_ERROR',
        reason: 'Database insert failed',
      });
      // Safe generic message to public callers — never expose raw dbError.message or table schema
      return new Response(
        JSON.stringify({ error: 'Unable to process inquiry at this time. Please try again or reach out directly.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 9. Structured log ONLY after database insertion has succeeded
    logStructured('info', {
      requestId,
      event: 'inquiry_created',
      outcome: 'success',
      httpStatus: 200,
      elapsedMs: getElapsedMs(startTime),
      inquiryType: validInquiryType,
      referenceCode: refCode,
    });

    return new Response(
      JSON.stringify({ success: true, referenceCode: refCode }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    logStructured('error', {
      requestId,
      event: 'unexpected_error',
      outcome: 'error',
      httpStatus: 500,
      elapsedMs: getElapsedMs(startTime),
      errorName: err?.name || 'Error',
      reason: 'Unexpected exception in Edge Function handler',
    });
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred while processing your request. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
