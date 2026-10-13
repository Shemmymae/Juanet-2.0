-- ==============================================================================
-- JUANET.cloud — Supabase Database Migration
-- Migration: 20261013000000_initial_schema.sql
-- Description: Core tables, constraints, indexes, Row Level Security, and policies
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- Table: site_settings
-- Stores approved, non-sensitive public business configurations.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    public_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- Table: services
-- Comprehensive catalog of digital services offered by JUANET.cloud.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    headline TEXT,
    category TEXT NOT NULL,
    icon_key TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    problems_solved JSONB NOT NULL DEFAULT '[]'::jsonb,
    deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
    suitable_use_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
    process_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
    related_services JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- Table: portfolio_projects
-- Genuine showcase of published work. Private/draft projects are never exposed.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    featured_image_path TEXT,
    technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
    client_name TEXT,
    client_visibility_approved BOOLEAN NOT NULL DEFAULT false,
    external_url TEXT,
    challenge TEXT,
    approach TEXT,
    outcomes TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- Table: portfolio_project_images
-- Multiple responsive display media per portfolio project.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.portfolio_project_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- Table: inquiries
-- Secure repository for contact messages, quotations, and consultation requests.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code TEXT UNIQUE NOT NULL,
    inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('contact', 'quotation', 'consultation')),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    organization TEXT,
    country TEXT,
    preferred_contact_method TEXT CHECK (preferred_contact_method IS NULL OR preferred_contact_method IN ('email', 'phone', 'whatsapp')),
    subject TEXT,
    service_id TEXT,
    project_summary TEXT,
    project_details TEXT,
    project_url TEXT,
    project_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    budget_range TEXT,
    preferred_timeline TEXT,
    preferred_start_date TEXT,
    consultation_date TEXT,
    consultation_time_window TEXT,
    timezone TEXT,
    privacy_consent BOOLEAN NOT NULL DEFAULT true CHECK (privacy_consent = true),
    consent_recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'contacted', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- Performance Indexes
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_order ON public.services(display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_status ON public.portfolio_projects(publication_status);
CREATE INDEX IF NOT EXISTS idx_portfolio_slug ON public.portfolio_projects(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON public.portfolio_projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_project_images_project ON public.portfolio_project_images(project_id, display_order);
CREATE INDEX IF NOT EXISTS idx_inquiries_ref ON public.inquiries(reference_code);
CREATE INDEX IF NOT EXISTS idx_inquiries_type_status ON public.inquiries(inquiry_type, status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON public.inquiries(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict least-privilege security model
-- ==============================================================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 1. site_settings: Public read-only
CREATE POLICY "Public visitors can read public site settings"
    ON public.site_settings
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 2. services: Public can only view published services
CREATE POLICY "Public visitors can view published services"
    ON public.services
    FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

-- 3. portfolio_projects: Public can only view published portfolio items
CREATE POLICY "Public visitors can view published portfolio projects"
    ON public.portfolio_projects
    FOR SELECT
    TO anon, authenticated
    USING (publication_status = 'published');

-- 4. portfolio_project_images: Public can only view images for published projects
CREATE POLICY "Public visitors can view images of published projects"
    ON public.portfolio_project_images
    FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.portfolio_projects p
            WHERE p.id = portfolio_project_images.project_id
            AND p.publication_status = 'published'
        )
    );

-- 5. inquiries: Public can insert valid inquiries ONLY; CANNOT READ, UPDATE, OR DELETE
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

-- Notice: NO SELECT, UPDATE, or DELETE policies exist for 'anon' on inquiries!
-- Anonymous users can NEVER list, inspect, or modify submitted inquiries.
-- Reading and managing inquiries is strictly reserved for authenticated administrators in Phase 2.
