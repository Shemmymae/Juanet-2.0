// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This is an optional trusted Edge Function for high-security inquiry submissions

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory rate limiting map for basic edge abuse mitigation
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();

    // 1. Basic IP rate limiting: max 10 requests per 10 minutes per IP
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

    // 2. Request body size check
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 65536) {
      // 64KB limit
      return new Response(
        JSON.stringify({ error: 'Payload too large.' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = await req.json();

    // 3. Honeypot check
    if (payload.honeypot && payload.honeypot.trim().length > 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid submission.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Validate fields
    if (!payload.fullName || !payload.email || !payload.privacyConsent) {
      return new Response(
        JSON.stringify({ error: 'Missing mandatory fields or consent.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email.trim())) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Connect to Supabase using server-side service role key (trusted backend only)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Server environment not configured.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const year = new Date().getFullYear();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    const refCode = `JN-${(payload.inquiryType || 'INQ').substring(0, 3).toUpperCase()}-${year}-${rand}`;

    const { error: dbError } = await supabase.from('inquiries').insert([
      {
        reference_code: refCode,
        inquiry_type: payload.inquiryType || 'contact',
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
          clientIp: clientIp,
          serviceSlug: payload.serviceSlug,
        },
      },
    ]);

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Database insertion error.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, referenceCode: refCode }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
