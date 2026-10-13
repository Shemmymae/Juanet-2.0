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
-- This should FAIL with check constraint violation:
-- INSERT INTO public.inquiries (
--     reference_code, inquiry_type, full_name, email, privacy_consent
-- ) VALUES (
--     'TEST-FAIL-01', 'contact', 'No Consent User', 'noconsent@test.com', false
-- );

RESET ROLE;
