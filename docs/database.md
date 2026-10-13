# JUANET.cloud — Database Architecture & Migrations

This document specifies the database foundation for **JUANET.cloud Phase 1** and outlines the architectural model for **Phase 2 (Client Portal & Admin Dashboard)**.

---

## 1. Phase 1 Schema Overview

Phase 1 establishes a secure, normalized PostgreSQL schema managed through Supabase migrations.

### Table: `public.site_settings`
Stores approved, non-sensitive public business configurations.
- `id` (UUID, Primary Key)
- `setting_key` (TEXT, Unique, Indexed)
- `public_value` (JSONB)
- `updated_at` (TIMESTAMPTZ)
- **RLS**: Public read-only (`SELECT` allowed for `anon` & `authenticated`).

### Table: `public.services`
Stores the official service catalog.
- `id` (TEXT, Primary Key)
- `slug` (TEXT, Unique, Indexed)
- `name` (TEXT)
- `headline` (TEXT)
- `category` (TEXT)
- `icon_key` (TEXT)
- `short_description` (TEXT)
- `full_description` (TEXT)
- `problems_solved` (JSONB)
- `deliverables` (JSONB)
- `suitable_use_cases` (JSONB)
- `process_steps` (JSONB)
- `faqs` (JSONB)
- `related_services` (JSONB)
- `is_published` (BOOLEAN, Default: `true`)
- `display_order` (INTEGER, Default: `0`, Indexed)
- `created_at` / `updated_at` (TIMESTAMPTZ)
- **RLS**: Public can only read published rows (`is_published = true`).

### Table: `public.portfolio_projects`
Stores case studies and portfolio works.
- `id` (UUID, Primary Key)
- `title` (TEXT)
- `slug` (TEXT, Unique, Indexed)
- `summary` (TEXT)
- `description` (TEXT)
- `category` (TEXT)
- `featured_image_path` (TEXT)
- `technologies` (JSONB)
- `client_name` (TEXT, Nullable)
- `client_visibility_approved` (BOOLEAN, Default: `false`)
- `external_url` (TEXT, Nullable)
- `challenge` / `approach` / `outcomes` (TEXT, Nullable)
- `is_featured` (BOOLEAN, Default: `false`, Indexed)
- `publication_status` (TEXT, Check: `'draft' | 'published' | 'archived'`, Indexed)
- `published_at` (TIMESTAMPTZ, Nullable)
- `created_at` / `updated_at` (TIMESTAMPTZ)
- **RLS**: Public can only read published rows (`publication_status = 'published'`).

### Table: `public.portfolio_project_images`
Multiple media assets associated with portfolio projects.
- `id` (UUID, Primary Key)
- `project_id` (UUID, Foreign Key to `portfolio_projects(id)` ON DELETE CASCADE)
- `storage_path` (TEXT)
- `alt_text` (TEXT)
- `caption` (TEXT, Nullable)
- `display_order` (INTEGER, Default: `0`)
- `created_at` (TIMESTAMPTZ)
- **RLS**: Public can only view images whose parent project is published.

### Table: `public.inquiries`
Unified intake repository for Contact, Quotations, and Consultations.
- `id` (UUID, Primary Key)
- `reference_code` (TEXT, Unique, Indexed — Format: `JN-TYPE-YYYY-XXXX`)
- `inquiry_type` (TEXT, Check: `'contact' | 'quotation' | 'consultation'`)
- `full_name` (TEXT)
- `email` (TEXT)
- `phone` (TEXT, Nullable)
- `organization` (TEXT, Nullable)
- `country` (TEXT, Nullable)
- `preferred_contact_method` (TEXT, Check: `'email' | 'phone' | 'whatsapp'`)
- `subject` (TEXT, Nullable)
- `service_id` (TEXT, Nullable)
- `project_summary` (TEXT, Nullable)
- `project_details` (TEXT, Nullable)
- `project_url` (TEXT, Nullable)
- `project_metadata` (JSONB)
- `budget_range` (TEXT, Nullable)
- `preferred_timeline` (TEXT, Nullable)
- `preferred_start_date` (TEXT, Nullable)
- `consultation_date` (TEXT, Nullable)
- `consultation_time_window` (TEXT, Nullable)
- `timezone` (TEXT, Nullable)
- `privacy_consent` (BOOLEAN, Must be `true`)
- `consent_recorded_at` (TIMESTAMPTZ, Default: `now()`)
- `status` (TEXT, Check: `'new' | 'reviewed' | 'contacted' | 'archived'`, Default: `'new'`)
- `created_at` / `updated_at` (TIMESTAMPTZ)
- **RLS**: Insert-only for public visitors. `anon` role has **ZERO** `SELECT`, `UPDATE`, or `DELETE` grants.

---

## 2. Migration Files

| File | Purpose |
| :--- | :--- |
| `supabase/migrations/20261013000000_initial_schema.sql` | Creates all tables, constraints, indexes, enables RLS, and binds least-privilege security policies. |
| `supabase/seed.sql` | Seeds the 12 canonical services, setting defaults, and zero fake clients. |
| `supabase/tests/database_security_test.sql` | Automated pgTAP / SQL verification queries confirming RLS policy enforcement. |

---

## 3. Future-Compatible Phase 2 Architecture

In Phase 2, a secure Client Portal and Administrator Dashboard will be introduced. The database is pre-architected so these can be mounted as new tables without altering Phase 1 public schema:

### Future Tables Design

1. **`profiles`**
   - References `auth.users(id)` ON DELETE CASCADE.
   - Stores `first_name`, `last_name`, `avatar_url`, `role` (`'client' | 'admin' | 'staff'`).

2. **`organizations`**
   - Stores corporate clients, schools, and partner institutions (`name`, `slug`, `billing_address`, `country`).

3. **`organization_memberships`**
   - Many-to-many relationship linking `profiles(id)` to `organizations(id)` with explicit role permissions (`'owner' | 'billing' | 'collaborator'`).

4. **`client_projects`**
   - Links to `organizations(id)` and `inquiries(id)`.
   - Tracks project status (`'discovery' | 'in_development' | 'review' | 'launched' | 'maintenance'`).

5. **`project_milestones` & `tasks`**
   - Detailed milestone schedule, deliverables checklist, and review status.

6. **`quotations` & `quotation_line_items`**
   - Formal digitized proposals created from incoming inquiries.

7. **`invoices` & `invoice_line_items`**
   - Tracks milestone billings, payment gateway callbacks (M-Pesa STK, Stripe), and receipts.

8. **`project_messages`**
   - Secure communication thread between clients and engineering team for specific active projects.

9. **`private_file_metadata`**
   - Tracks private deliverable files in the `project-private` Supabase Storage bucket, accessed strictly via short-lived signed URLs.

10. **`audit_events`**
    - Security log capturing user logins, status modifications, and permission shifts.
