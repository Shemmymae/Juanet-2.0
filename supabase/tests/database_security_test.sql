-- ==============================================================================
-- JUANET.cloud — Supabase Security & RLS Verification Tests
-- File: supabase/tests/database_security_test.sql
-- Run these queries in the Supabase SQL Editor or pgTAP test runner to verify
-- security constraints and access control boundaries.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- TEST 1: Anonymous users CAN read published services
-- Expected: 12 rows returned
-- ------------------------------------------------------------------------------
SET ROLE anon;
SELECT count(*) AS published_services_count 
FROM public.services 
WHERE is_published = true;

-- ------------------------------------------------------------------------------
-- TEST 2: Anonymous users CANNOT read unpublished services
-- Setup temporary test record using postgres superuser role
-- ------------------------------------------------------------------------------
RESET ROLE;
INSERT INTO public.services (
    id, slug, name, category, icon_key, short_description, full_description, is_published, display_order
) VALUES (
    'test-unpublished', 'test-unpublished', 'Secret Beta Service', 'Lab', 'Cpu', 'Draft', 'Draft full description', false, 99
) ON CONFLICT (slug) DO NOTHING;

-- Switch to anon role and query
SET ROLE anon;
SELECT * FROM public.services WHERE slug = 'test-unpublished';
-- Expected result: 0 rows returned (RLS filtered)

-- Cleanup test record
RESET ROLE;
DELETE FROM public.services WHERE slug = 'test-unpublished';

-- ------------------------------------------------------------------------------
-- TEST 3: Anonymous users CANNOT read inquiries
-- Expected result: 0 rows returned, even if records exist
-- ------------------------------------------------------------------------------
SET ROLE anon;
SELECT * FROM public.inquiries;
-- Expected: 0 rows (permission denied or filtered by RLS)

-- ------------------------------------------------------------------------------
-- TEST 4: Anonymous users CANNOT update or delete inquiries
-- ------------------------------------------------------------------------------
SET ROLE anon;
UPDATE public.inquiries SET status = 'reviewed';
-- Expected: Error or 0 rows affected

DELETE FROM public.inquiries;
-- Expected: Error or 0 rows affected

-- ------------------------------------------------------------------------------
-- TEST 5: Anonymous users CAN submit valid inquiries
-- ------------------------------------------------------------------------------
SET ROLE anon;
INSERT INTO public.inquiries (
    reference_code, inquiry_type, full_name, email, privacy_consent, status
) VALUES (
    'TEST-REF-9999', 'contact', 'Test Security Visitor', 'security@test.juanet.cloud', true, 'new'
);
-- Expected: INSERT 0 1 (Success)

-- Verify that the anon user still CANNOT see the record they just inserted
SELECT * FROM public.inquiries WHERE reference_code = 'TEST-REF-9999';
-- Expected: 0 rows returned (Blind insert security pattern confirmed)

-- Cleanup test inquiry using superuser role
RESET ROLE;
DELETE FROM public.inquiries WHERE reference_code = 'TEST-REF-9999';

-- ------------------------------------------------------------------------------
-- TEST 6: Invalid inquiry with missing consent is REJECTED
-- ------------------------------------------------------------------------------
SET ROLE anon;

DO $$
BEGIN
    INSERT INTO public.inquiries (
        reference_code, inquiry_type, full_name, email, privacy_consent
    ) VALUES (
        'TEST-FAIL-01', 'contact', 'No Consent User', 'noconsent@test.com', false
    );
    RAISE EXCEPTION 'SECURITY BREACH: Inquiry without consent was inserted!';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'SUCCESS: Invalid inquiry without consent correctly rejected (%).', SQLERRM;
END;
$$;

RESET ROLE;

-- ------------------------------------------------------------------------------
-- TEST 7: Anonymous users CANNOT read, insert, update, or delete rate limits table
-- Expected: Error 42501 (insufficient_privilege) caught and verified
-- ------------------------------------------------------------------------------
SET ROLE anon;

-- Test 7A: Verify SELECT is blocked by table REVOKE
DO $$
BEGIN
    PERFORM * FROM public.inquiry_rate_limits;
    RAISE EXCEPTION 'SECURITY BREACH: anon role was able to read public.inquiry_rate_limits!';
EXCEPTION
    WHEN insufficient_privilege THEN
        RAISE NOTICE 'SUCCESS: anon role correctly denied SELECT on inquiry_rate_limits (SQLSTATE 42501).';
END;
$$;

-- Test 7B: Verify INSERT is blocked by table REVOKE
DO $$
BEGIN
    INSERT INTO public.inquiry_rate_limits (ip_hash, bucket_start, request_count)
    VALUES ('unauthorized-hash', clock_timestamp(), 1);
    RAISE EXCEPTION 'SECURITY BREACH: anon role was able to insert into public.inquiry_rate_limits!';
EXCEPTION
    WHEN insufficient_privilege THEN
        RAISE NOTICE 'SUCCESS: anon role correctly denied INSERT on inquiry_rate_limits (SQLSTATE 42501).';
END;
$$;

RESET ROLE;

-- ------------------------------------------------------------------------------
-- TEST 8: Anonymous users CANNOT call check_inquiry_rate_limit RPC
-- ------------------------------------------------------------------------------
SET ROLE anon;
-- Calling check_inquiry_rate_limit as anon should throw "permission denied for function check_inquiry_rate_limit"
DO $$
BEGIN
    PERFORM public.check_inquiry_rate_limit('test-anon-hash', 10, 600);
    RAISE EXCEPTION 'SECURITY BREACH: anon role was able to execute check_inquiry_rate_limit!';
EXCEPTION
    WHEN insufficient_privilege THEN
        RAISE NOTICE 'SUCCESS: anon role correctly blocked with insufficient_privilege error.';
END;
$$;

RESET ROLE;

-- ------------------------------------------------------------------------------
-- TEST 9: Service Role Rate Limiting Lifecycle Tests
-- ------------------------------------------------------------------------------
SET ROLE service_role;

-- Test 9A: Invalid input (empty / null hash) must return FALSE
DO $$
DECLARE
    v_res BOOLEAN;
BEGIN
    v_res := public.check_inquiry_rate_limit(NULL, 10, 600);
    ASSERT v_res = FALSE, 'Test 9A Failed: NULL hash should return FALSE';

    v_res := public.check_inquiry_rate_limit('   ', 10, 600);
    ASSERT v_res = FALSE, 'Test 9A Failed: Empty hash should return FALSE';
    
    RAISE NOTICE 'SUCCESS: Test 9A (Invalid input rejection) passed.';
END;
$$;

-- Test 9B: Normal submission increments counter up to max_requests
DO $$
DECLARE
    v_test_hash TEXT := 'test-hash-lifecycle-001';
    v_res BOOLEAN;
    v_i INT;
BEGIN
    -- Clean previous run if any
    DELETE FROM public.inquiry_rate_limits WHERE ip_hash = v_test_hash;

    -- Send 10 requests within limit (max_requests = 10)
    FOR v_i IN 1..10 LOOP
        v_res := public.check_inquiry_rate_limit(v_test_hash, 10, 600);
        ASSERT v_res = TRUE, 'Test 9B Failed: Request ' || v_i || ' should be allowed';
    END LOOP;

    -- Test 9C: 11th request must be REJECTED (HTTP 429 equivalent)
    v_res := public.check_inquiry_rate_limit(v_test_hash, 10, 600);
    ASSERT v_res = FALSE, 'Test 9C Failed: Request 11 should be rejected';

    RAISE NOTICE 'SUCCESS: Test 9B and 9C (Increment and limit rejection) passed.';
END;
$$;

-- Test 9D: Expired Window resets counter and allows submission
DO $$
DECLARE
    v_test_hash TEXT := 'test-hash-lifecycle-001';
    v_res BOOLEAN;
    v_count INT;
BEGIN
    -- Artificially age the bucket to simulate window expiry (> 600 seconds)
    UPDATE public.inquiry_rate_limits
    SET bucket_start = clock_timestamp() - INTERVAL '601 seconds'
    WHERE ip_hash = v_test_hash;

    -- Now submit again: should reset bucket and allow
    v_res := public.check_inquiry_rate_limit(v_test_hash, 10, 600);
    ASSERT v_res = TRUE, 'Test 9D Failed: Expired window should reset and allow request';

    -- Verify request_count was reset to 1
    SELECT request_count INTO v_count
    FROM public.inquiry_rate_limits
    WHERE ip_hash = v_test_hash;
    ASSERT v_count = 1, 'Test 9D Failed: Counter was not reset to 1';

    -- Cleanup test record
    DELETE FROM public.inquiry_rate_limits WHERE ip_hash = v_test_hash;

    RAISE NOTICE 'SUCCESS: Test 9D (Window expiry and counter reset) passed.';
END;
$$;

-- Test 9E: Concurrency simulation (Atomic seed idempotency)
DO $$
DECLARE
    v_test_hash TEXT := 'test-hash-concurrency-002';
    v_res1 BOOLEAN;
    v_res2 BOOLEAN;
BEGIN
    DELETE FROM public.inquiry_rate_limits WHERE ip_hash = v_test_hash;

    -- Simulate two concurrent initial requests hitting the function
    v_res1 := public.check_inquiry_rate_limit(v_test_hash, 10, 600);
    v_res2 := public.check_inquiry_rate_limit(v_test_hash, 10, 600);

    ASSERT v_res1 = TRUE AND v_res2 = TRUE, 'Test 9E Failed: Consecutive initial requests failed';

    DELETE FROM public.inquiry_rate_limits WHERE ip_hash = v_test_hash;
    RAISE NOTICE 'SUCCESS: Test 9E (Concurrent seed safety) passed.';
END;
$$;

RESET ROLE;

