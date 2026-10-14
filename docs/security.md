# JUANET.cloud — Security Architecture & Guidelines

This document details the security model, access controls, data boundaries, and threat mitigation implemented in **JUANET.cloud Phase 1**.

---

## 1. Core Security Principles

1. **Least-Privilege by Default**: Public visitors (`anon` role) are granted the minimal permissions required to read published marketing content and submit validated inquiries.
2. **Strict Row Level Security (RLS)**: Every table exposed in the PostgreSQL schema has RLS enforced.
3. **No Frontend Secrets**: Only the browser-safe `anon` / publishable key is bundled into the client application. The `service_role` key is strictly prohibited in client bundles.
4. **Blind Insert Pattern for Inquiries**: Public visitors can submit inquiries, but they can **never** query or read the table. Anonymous visitors cannot read their own or anyone else's submitted records.

---

## 2. Table-by-Table RLS Enforcement

| Table | `anon` SELECT | `anon` INSERT | `anon` UPDATE | `anon` DELETE | Security Logic |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `site_settings` | **Allowed** | Denied | Denied | Denied | Read-only public configurations. |
| `services` | **Conditional** | Denied | Denied | Denied | Only rows with `is_published = true` are readable. |
| `portfolio_projects` | **Conditional** | Denied | Denied | Denied | Only rows with `publication_status = 'published'` are readable. |
| `portfolio_project_images` | **Conditional** | Denied | Denied | Denied | Only images linked to published projects are readable. |
| `inquiries` | **DENIED** | **Conditional** | **DENIED** | **DENIED** | Insert allowed only with valid name, email, and consent check. Zero read/update/delete. |

### Inquiries Insert Policy Code
```sql
CREATE POLICY "Public visitors can submit valid inquiries"
    ON public.inquiries
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        privacy_consent = true
        AND length(trim(full_name)) >= 2
        AND length(trim(email)) >= 5
        AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    );
```

---

## 3. Storage Security Architecture

### Bucket: `portfolio-public`
- **Purpose**: Public thumbnails and display images for published case studies.
- **Access**: Public read access allowed for static asset rendering.
- **Write Policy**: Restricted to authenticated administrators.

### Bucket: `project-private` (Reserved for Phase 2)
- **Purpose**: Client deliverables, architecture blueprints, proprietary contracts, and sensitive invoices.
- **Access**: Strictly private (`public = false`).
- **Authorization**: Access granted only through short-lived signed URLs generated server-side for authenticated organization members.

---

## 4. Abuse Prevention & Spam Defense

1. **Honeypot Technique**: All public forms include an invisible input field (`honeypot`). Real users cannot see or fill this input; automated scrapers and bots that fill all inputs are rejected immediately.
2. **Client-side & Server-side Validation**: Field types, email formats, and mandatory consent are validated both in the React form state and at the database/edge level.
3. **Edge Function Protection & Structured Logging**: The Supabase Edge Function (`supabase/functions/submit-inquiry/index.ts`) enforces IP rate-limiting (maximum 10 requests per 10 minutes), 64KB payload bounds, and emits machine-parseable JSON structured logs:
   - Tracks request receipt, validation rejection, rate-limit rejection, successful insertion, and unexpected exceptions.
   - Includes unique `requestId` (UUID v4), valid `inquiryType`, outcome status, HTTP status code, and `elapsedMs`.
   - **Zero-PII Logging Guarantee**: Full names, email addresses, phone numbers, free-form project descriptions, full request bodies, auth tokens, and `service_role` keys are strictly prohibited from log lines.
   - Internal database errors and server exceptions are logged securely on the backend while public callers receive clean, sanitized generic responses.

---

## 5. Security Audit Checklist

- [x] RLS enabled on all exposed tables.
- [x] No `VITE_` variable contains `service_role` or database administrator credentials.
- [x] Unpublished projects (`draft`, `archived`) filtered at the database level.
- [x] Inquiries table cannot be read by anonymous users.
- [x] Reference codes generated using cryptographically safe random values.
- [x] HTTPS enforced in production deployment.
