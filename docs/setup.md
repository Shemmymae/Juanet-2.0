# JUANET.cloud — Setup & Development Guide

This guide details how to clone, install, configure, and run the **JUANET.cloud Phase 1 Public Website** locally or on any standard Node.js development environment.

---

## 1. Prerequisites

- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **Package Manager**: `npm` (v10+)
- **Git**

---

## 2. Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/juanet-cloud.git
   cd juanet-cloud
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

## 3. Environment Configuration

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### Environment Variables Reference

| Variable | Description | Safe for Browser? |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Your Supabase project URL (e.g. `https://xyz.supabase.co`) | Yes (Browser-safe) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable / anon public API key | Yes (Browser-safe) |
| `VITE_SITE_URL` | Canonical production domain (`https://juanet.cloud`) | Yes |
| `VITE_CONTACT_EMAIL` | Optional override for public inquiry email | Yes |
| `VITE_WHATSAPP_NUMBER` | Optional international WhatsApp number (digits only, e.g. `254700000000`) | Yes |
| `VITE_SCHEDULING_URL` | Optional external calendar URL (e.g. Cal.com / Calendly) | Yes |

> **CRITICAL SECURITY NOTE:**
> Never place the Supabase `service_role` secret key in any `.env` file prefixed with `VITE_`.
> Frontend builds bundle all `VITE_` variables into the public JavaScript output. The `service_role` key must exist **only** in secure server environments or Supabase Edge Functions.

---

## 4. Supabase Setup & Migrations

If you want persistent database inquiries and dynamic service/portfolio updates:

1. Create a project at [supabase.com](https://supabase.com).
2. Navigate to **SQL Editor** in the Supabase Dashboard.
3. Run the migration script located at:
   `supabase/migrations/20261013000000_initial_schema.sql`
4. Run the seed script to populate the 12 canonical services:
   `supabase/seed.sql`
5. Copy your **Project URL** and **anon/publishable key** from **Project Settings > API** into `.env`.

*Note: If Supabase credentials are not provided, the website runs automatically in resilient preview mode with all 12 services fully functional from the local catalog.*

---

## 5. Running the Application

### Development Server
```bash
npm run dev
```
Access the application at `http://localhost:3000`.

### Type Checking & Linting
```bash
npm run lint
```

### Production Build
```bash
npm run build
```
Generates production-optimized static assets in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```
