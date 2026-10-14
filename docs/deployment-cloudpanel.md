# JUANET.cloud — Production Deployment Guide (Hostinger VPS & CloudPanel)

This guide provides definitive, production-tested instructions for deploying the **JUANET.cloud Phase 1 Frontend** to a **Hostinger VPS** managed through **CloudPanel**, integrated with your existing **Supabase** backend (Project Ref: `qaxctkradwquzwyvrpfe`) and deployed Edge Function (`submit-inquiry`).

---

## 1. Architectural Separation

The platform consists of two decoupled, independently deployable components:

| Component | Technology | Hosting Platform | Deployment Method |
| :--- | :--- | :--- | :--- |
| **Public Website (Frontend)** | Vite + React + TypeScript + Tailwind CSS | Hostinger VPS via CloudPanel (Nginx) | Static SPA Build (`dist/`) |
| **Inquiry Gateway (Backend)** | Deno / Supabase Edge Functions | Supabase Cloud (`qaxctkradwquzwyvrpfe`) | GitHub Actions / Supabase CLI |
| **Database & Storage** | PostgreSQL + Row Level Security (RLS) | Supabase Cloud | Managed Migrations |

---

## 2. Workstation & Build Prerequisites

- **Node.js**: `v20.x` or `v22.x` (LTS)
- **Package Manager**: `npm` (v10+)
- **Build Output Directory**: `dist/` (static assets)
- **Runtime Requirement on VPS**: **Pure Static Nginx Web Server**. No continuous Node.js background daemon (PM2, Docker, or tsx) is required or recommended on the VPS for Phase 1.

---

## 3. Environment Variable Configuration

Because Vite compiles `import.meta.env.VITE_*` statically into the JavaScript bundle at build time, **environment variables must be present during `npm run build`**.

Create your production `.env` file on your build machine (CI/CD runner or local terminal):

```bash
# -----------------------------------------------------------------------------
# Supabase Configuration (Client-Safe Publishable Key ONLY)
# Never place the SUPABASE_SERVICE_ROLE_KEY in this file!
# -----------------------------------------------------------------------------
VITE_SUPABASE_URL=https://qaxctkradwquzwyvrpfe.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-or-publishable-key

# Canonical Production URL
VITE_SITE_URL=https://juanet.cloud

# Optional Verified Business Contact Overrides (leave blank or omit to use defaults)
VITE_CONTACT_EMAIL=contact@juanet.cloud
VITE_CONTACT_PHONE=
VITE_CONTACT_PHONE_DISPLAY=
VITE_WHATSAPP_NUMBER=
VITE_WHATSAPP_DISPLAY=
VITE_PHYSICAL_LOCATION=Nairobi, Kenya & Remote Globally
VITE_POSTAL_ADDRESS=

# Optional Social Links (only rendered in UI if populated)
VITE_SOCIAL_LINKEDIN=
VITE_SOCIAL_TWITTER=
VITE_SOCIAL_GITHUB=

# Optional Scheduling Calendar (e.g. Cal.com or Calendly)
VITE_SCHEDULING_URL=
```

> **SECURITY CHECK**: Confirm that `VITE_SUPABASE_PUBLISHABLE_KEY` is your public `anon` key (starts with `ey...` or `sb_publishable_...`). Never use your `service_role` key in frontend `.env` files.

---

## 4. Compile Production Static Assets

Run the clean build process on your build workstation:

```bash
# 1. Install dependencies
npm ci

# 2. Type check
npm run lint

# 3. Build optimized static bundle
npm run build
```

This compiles all HTML, CSS, JavaScript, and public assets (`robots.txt`, `sitemap.xml`, `favicon.svg`, `logo.svg`) into the **`dist/`** directory.

---

## 5. Hostinger VPS & CloudPanel Setup

### Step 5.1: Create Static Site in CloudPanel
1. Access your CloudPanel admin interface at `https://your-vps-ip:8443`.
2. Navigate to **Sites** > **Add Site** > **Static Site**.
3. Fill in the site details:
   - **Domain Name**: `juanet.cloud`
   - **Site User**: Select or create a dedicated user (e.g. `juanet`).
   - **Application**: Static HTML / JS.
4. Note your site document root path:
   ```bash
   /home/juanet/htdocs/juanet.cloud
   ```

### Step 5.2: Configure DNS in Cloudflare / Hostinger
Ensure your DNS records point to your Hostinger VPS IP:
- **A Record**: `@` (or `juanet.cloud`) $\rightarrow$ `YOUR_HOSTINGER_VPS_IP`
- **A or CNAME Record**: `www` $\rightarrow$ `YOUR_HOSTINGER_VPS_IP` (or `juanet.cloud`)

#### Cloudflare Proxy (Orange Cloud) vs Direct SSL Consideration:
- **Initial Certificate Issuance**: If using Cloudflare proxy (orange cloud), set Cloudflare SSL/TLS encryption mode to **Full (Strict)**.
- If CloudPanel Let's Encrypt validation fails due to Cloudflare proxying HTTP verification tokens, temporarily toggle Cloudflare to **DNS Only (Grey Cloud)**, issue the certificate in CloudPanel, and then toggle back to **Proxied (Orange Cloud)**.

### Step 5.3: SSL / TLS Certificate in CloudPanel
1. In CloudPanel, go to **Sites** > **juanet.cloud** > **SSL/TLS**.
2. Click **New Let's Encrypt Certificate**.
3. Select both `juanet.cloud` and `www.juanet.cloud`.
4. Click **Create and Install**.
5. Enable **Force HTTPS**.

---

## 6. Configure Nginx VHost for Single-Page Application (SPA) Routing

Because React Router handles subroutes on the client (e.g. `/services/web-development`, `/request-service`, `/portfolio`), Nginx must rewrite all non-file requests to `/index.html`. Without this, refreshing a subroute causes an Nginx 404 error.

1. In CloudPanel, go to **Sites** > **juanet.cloud** > **Vhost**.
2. Replace or update the server configuration with the following production-hardened template:

```nginx
server {
  listen 80;
  listen [::]:80;
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name juanet.cloud www.juanet.cloud;
  root /home/juanet/htdocs/juanet.cloud;

  # Managed SSL certificates
  # {{ssl_certificate_key}}
  # {{ssl_certificate}}

  index index.html;

  # Security Headers
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

  # Gzip Compression
  gzip on;
  gzip_vary on;
  gzip_proxied any;
  gzip_comp_level 6;
  gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

  # Cache Static Assets (Vite hashed bundles in /assets/)
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
    access_log off;
    try_files $uri =404;
  }

  # Static Root Files (robots.txt, sitemap.xml, favicon.svg, logo.svg)
  location ~* \.(?:ico|svg|png|jpg|jpeg|webp|xml|txt)$ {
    expires 7d;
    add_header Cache-Control "public, max-age=604800";
    try_files $uri =404;
  }

  # SPA Routing Fallback: Route all navigation paths to index.html
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Deny Access to Hidden Files (.git, .env, etc.)
  location ~ /\. {
    deny all;
    access_log off;
    log_not_found off;
  }
}
```
3. Save the VHost. CloudPanel validates syntax and reloads Nginx immediately.

---

## 7. Deploying Build Artifacts to Hostinger VPS

### Recommended: Zero-Downtime Symlink Deployment
Run from your build machine / workstation:

```bash
# Set your variables
VPS_USER="juanet"
VPS_HOST="your-vps-ip"
RELEASE_TAG=$(date +%Y%m%d%H%M%S)

# 1. Create releases directory on server
ssh ${VPS_USER}@${VPS_HOST} "mkdir -p /home/juanet/releases/${RELEASE_TAG}"

# 2. Upload dist contents
rsync -avz --delete dist/ ${VPS_USER}@${VPS_HOST}:/home/juanet/releases/${RELEASE_TAG}/

# 3. Atomically switch active symlink
ssh ${VPS_USER}@${VPS_HOST} "ln -sfn /home/juanet/releases/${RELEASE_TAG} /home/juanet/htdocs/juanet.cloud"

# 4. Enforce strict permissions
ssh ${VPS_USER}@${VPS_HOST} "chmod -R 755 /home/juanet/releases/${RELEASE_TAG}"
```

### Direct Rsync Method (Alternative)
```bash
rsync -avz --delete dist/ juanet@your-vps-ip:/home/juanet/htdocs/juanet.cloud/
```

---

## 8. Supabase Backend & Edge Function Deployment

The Edge Function handles validated submissions with structured JSON logging and burst rate limiting.

### Automated via GitHub Actions
Ensure these two secrets are configured in your GitHub repository (**Settings** > **Secrets and variables** > **Actions**):
- `SUPABASE_ACCESS_TOKEN`: Your Personal Access Token from Supabase Dashboard > Account Settings > Access Tokens.
- `SUPABASE_PROJECT_REF`: `qaxctkradwquzwyvrpfe`

Any push modifying `supabase/functions/submit-inquiry/**` triggers the `.github/workflows/deploy-supabase-function.yml` workflow and deploys automatically.

### Manual CLI Deployment (Alternative)
```bash
# Login to Supabase CLI
supabase login

# Link your project
supabase link --project-ref qaxctkradwquzwyvrpfe

# Deploy Edge Function without requiring public user JWT
supabase functions deploy submit-inquiry --no-verify-jwt
```

---

## 9. Live Verification Checklist

Perform these checks on the live site (`https://juanet.cloud`):

1. **Direct Navigation & Refresh Test**:
   - Navigate directly to `https://juanet.cloud/services/web-development`.
   - Press `Ctrl + F5` (hard refresh).
   - Expected: Page renders smoothly without Nginx 404.
2. **Missing Asset 404 Test**:
   - Request `https://juanet.cloud/missing-asset.png`.
   - Expected: Genuine 404 status, not `index.html`.
3. **SEO & Crawl Assets**:
   - Request `https://juanet.cloud/robots.txt` $\rightarrow$ Returns text/plain directives.
   - Request `https://juanet.cloud/sitemap.xml` $\rightarrow$ Returns 21 catalog URLs.
   - Request `https://juanet.cloud/favicon.svg` $\rightarrow$ Returns vector monogram.
4. **Forms Live Testing**:
   - **Contact Form** (`/contact`): Submit valid message $\rightarrow$ Expect reference code `JN-CON-2026-XXXX`.
   - **Quotation Form** (`/request-service`): Complete 4-step wizard $\rightarrow$ Expect reference code `JN-QUO-2026-XXXX`.
   - **Consultation Form** (`/book-consultation`): Submit meeting request $\rightarrow$ Expect reference code `JN-CON-2026-XXXX`.
   - Check Supabase Dashboard > **Table Editor** > `inquiries` to verify rows.
   - Check Supabase Dashboard > **Edge Functions** > `submit-inquiry` > **Logs** to verify structured JSON log entries.
5. **Anti-Abuse Verification**:
   - Submit a form with the hidden `honeypot` filled $\rightarrow$ Expect clean `400 Invalid submission.`
   - Submit rapid repeated requests $\rightarrow$ Expect `429 Too many submissions.`

---

## 10. Instant Rollback Procedure

If a release causes an unforeseen defect on the live site:

```bash
# List previous release directories
ssh juanet@your-vps-ip "ls -la /home/juanet/releases/"

# Re-point the symlink to the previous good release
ssh juanet@your-vps-ip "ln -sfn /home/juanet/releases/PREVIOUS_RELEASE_TAG /home/juanet/htdocs/juanet.cloud"
```
The rollback takes effect in 0 seconds with zero downtime.
