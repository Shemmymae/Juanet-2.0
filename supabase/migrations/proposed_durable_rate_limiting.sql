-- ==============================================================================
-- JUANET.cloud — Production-Hardened Durable Rate Limiting Migration
-- File: supabase/migrations/proposed_durable_rate_limiting.sql
-- Status: PROPOSED (Review before executing in Supabase SQL Editor)
--
-- PURPOSE:
-- Implements an atomic, distributed, database-backed sliding-window rate limiter
-- for the public inquiry submission gateway (submit-inquiry).
-- Enforces limits uniformly across cold starts, server restarts, and concurrent
-- multi-region Edge Function isolates.
--
-- CONCURRENCY SAFETY:
-- Uses atomic seed insertion with ON CONFLICT DO NOTHING followed by an exclusive
-- row lock (FOR UPDATE). Eliminates race conditions and duplicate-key exceptions
-- under high concurrent traffic.
--
-- PRIVACY PROTECTION:
-- Stores exclusively a cryptographic SHA-256 hash of the client IP address.
-- Raw client IP addresses are NEVER persisted in this table or database logs.
-- ==============================================================================

-- 1. Create table for durable rate-limit tracking
CREATE TABLE IF NOT EXISTS public.inquiry_rate_limits (
    ip_hash TEXT PRIMARY KEY,
    bucket_start TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    request_count INTEGER NOT NULL DEFAULT 1,
    last_request_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- 2. Performance index for bucket expiry lookups and maintenance pruning
CREATE INDEX IF NOT EXISTS idx_rate_limits_bucket_start 
    ON public.inquiry_rate_limits (bucket_start);

-- 3. Row Level Security (RLS) Configuration
ALTER TABLE public.inquiry_rate_limits ENABLE ROW LEVEL SECURITY;

-- Explicitly deny all direct operations to public roles (anon and authenticated)
DROP POLICY IF EXISTS "Deny all public access to rate limits" ON public.inquiry_rate_limits;
CREATE POLICY "Deny all public access to rate limits"
    ON public.inquiry_rate_limits
    FOR ALL
    TO anon, authenticated
    USING (false);

-- Revoke table permissions from public roles; grant full access to service_role only
REVOKE ALL ON TABLE public.inquiry_rate_limits FROM PUBLIC;
REVOKE ALL ON TABLE public.inquiry_rate_limits FROM anon;
REVOKE ALL ON TABLE public.inquiry_rate_limits FROM authenticated;
GRANT ALL ON TABLE public.inquiry_rate_limits TO service_role;

-- 4. Atomic Rate Check & Increment Function
-- Returns TRUE if request is accepted, FALSE if rate limit is exceeded.
CREATE OR REPLACE FUNCTION public.check_inquiry_rate_limit(
    p_ip_hash TEXT,
    p_max_requests INT DEFAULT 10,
    p_window_seconds INT DEFAULT 600
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_record RECORD;
    v_now TIMESTAMPTZ := clock_timestamp();
    v_window_interval INTERVAL := make_interval(secs => p_window_seconds);
BEGIN
    -- Input validation: Reject empty or null IP hashes immediately
    IF p_ip_hash IS NULL OR length(trim(p_ip_hash)) = 0 THEN
        RETURN FALSE;
    END IF;

    -- Step 1: Ensure row exists atomically without race conditions
    -- If two concurrent requests arrive simultaneously, one inserts and the other does nothing.
    INSERT INTO public.inquiry_rate_limits (ip_hash, bucket_start, request_count, last_request_at)
    VALUES (p_ip_hash, v_now, 0, v_now)
    ON CONFLICT (ip_hash) DO NOTHING;

    -- Step 2: Acquire exclusive row-level lock for atomic evaluation
    SELECT * INTO v_record
    FROM public.inquiry_rate_limits
    WHERE ip_hash = p_ip_hash
    FOR UPDATE;

    -- Step 3: Check if the previous rate-limit window has expired
    IF (v_now - v_record.bucket_start) >= v_window_interval THEN
        -- Window expired; reset counter to 1 and start fresh window
        UPDATE public.inquiry_rate_limits
        SET bucket_start = v_now,
            request_count = 1,
            last_request_at = v_now
        WHERE ip_hash = p_ip_hash;
        RETURN TRUE;

    -- Step 4: Within active window and under limit; increment counter
    ELSIF v_record.request_count < p_max_requests THEN
        UPDATE public.inquiry_rate_limits
        SET request_count = request_count + 1,
            last_request_at = v_now
        WHERE ip_hash = p_ip_hash;
        RETURN TRUE;

    -- Step 5: Rate limit reached or exceeded; reject request
    ELSE
        UPDATE public.inquiry_rate_limits
        SET last_request_at = v_now
        WHERE ip_hash = p_ip_hash;
        RETURN FALSE;
    END IF;
END;
$$;

-- 5. Revoke public execution rights; grant execute exclusively to service_role
REVOKE ALL ON FUNCTION public.check_inquiry_rate_limit(TEXT, INT, INT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.check_inquiry_rate_limit(TEXT, INT, INT) FROM anon;
REVOKE ALL ON FUNCTION public.check_inquiry_rate_limit(TEXT, INT, INT) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.check_inquiry_rate_limit(TEXT, INT, INT) TO service_role;

-- 6. Maintenance Cleanup Routine
-- Prunes rate-limiting buckets older than 2 hours to keep the table compact
CREATE OR REPLACE FUNCTION public.cleanup_stale_rate_limits()
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    DELETE FROM public.inquiry_rate_limits
    WHERE bucket_start < (clock_timestamp() - INTERVAL '2 hours');
$$;

REVOKE ALL ON FUNCTION public.cleanup_stale_rate_limits() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cleanup_stale_rate_limits() FROM anon;
REVOKE ALL ON FUNCTION public.cleanup_stale_rate_limits() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_stale_rate_limits() TO service_role;
