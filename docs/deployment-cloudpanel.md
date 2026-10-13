# JUANET.cloud — CloudPanel Static Deployment Guide

This guide provides step-by-step instructions for deploying the **JUANET.cloud Phase 1 Frontend** to a production VPS running **CloudPanel**.

---

## Architecture Summary
- **Target Domain**: `https://juanet.cloud`
- **Application Type**: High-performance Static Single-Page Application (SPA) built with Vite, React, and TypeScript.
- **Server Software**: Nginx (managed through CloudPanel).
- **Backend / Database**: External Supabase project (managed independently).
- **Operational Requirement**: No persistent Node.js background process is required on the server. The application is served purely as static files through Nginx.

---

## Step 1: Create Website in CloudPanel

1. Log into your CloudPanel admin interface: `https://your-server-ip:8443`.
2. Navigate to **Sites** > **Add Site** > **Static Site**.
3. Fill in:
   - **Domain Name**: `juanet.cloud`
   - **Site User**: Select an existing site user or create a dedicated one (e.g., `juanet`).
4. Note the site root path, typically:
   ```bash
   /home/juanet/htdocs/juanet.cloud
   ```

---

## Step 2: Configure Environment & Run Production Build

On your local workstation or CI/CD runner:

1. Clone or export the repository:
   ```bash
   git clone https://github.com/your-org/juanet-cloud.git
   cd juanet-cloud
   ```

2. Verify Node.js version (`>= 20.x`):
   ```bash
   node -v
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Prepare your production `.env` file:
   ```bash
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   VITE_SITE_URL=https://juanet.cloud
   VITE_CONTACT_EMAIL=contact@juanet.cloud
   ```

5. Run the production build:
   ```bash
   npm run build
   ```
   This generates the optimized static bundles in the `dist/` directory.

---

## Step 3: Deploy Build Artifacts to Server

Transfer the contents of `dist/` to the CloudPanel website root using `rsync` or SFTP:

```bash
# Using rsync (recommended)
rsync -avz --delete dist/ juanet@your-server-ip:/home/juanet/htdocs/juanet.cloud/
```

Verify permissions on the server:
```bash
chown -R juanet:juanet /home/juanet/htdocs/juanet.cloud/
chmod -R 755 /home/juanet/htdocs/juanet.cloud/
```

---

## Step 4: Configure HTTPS & Let's Encrypt SSL

1. In CloudPanel, go to **Sites** > **juanet.cloud** > **SSL/TLS**.
2. Click **New Let's Encrypt Certificate**.
3. Ensure DNS records for `juanet.cloud` and `www.juanet.cloud` point to your VPS IP.
4. Click **Create and Install**.
5. Enable **Force HTTPS**.

---

## Step 5: Configure Nginx VHost for SPA Routing (Crucial)

To ensure that direct visits or page refreshes on subroutes (such as `/services/web-development`, `/portfolio`, `/request-service`) render correctly rather than throwing an Nginx 404 error:

1. In CloudPanel, go to **Sites** > **juanet.cloud** > **Vhost**.
2. Locate the main `location /` block and update it as follows:

```nginx
server {
  listen 80;
  listen [::]:80;
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name juanet.cloud www.juanet.cloud;
  root /home/juanet/htdocs/juanet.cloud;

  # SSL certificates managed by CloudPanel
  # {{ssl_certificate_key}}
  # {{ssl_certificate}}

  index index.html;

  # Security headers
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;

  # Cache static assets (JS, CSS, images, fonts)
  location ~* \.(?:ico|css|js|gif|jpe?g|png|webp|svg|woff2?|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
    access_log off;
    try_files $uri =404;
  }

  # SPA Fallback for all React Router client paths
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Disallow access to hidden files
  location ~ /\. {
    deny all;
    access_log off;
    log_not_found off;
  }
}
```

3. Save the Vhost configuration. CloudPanel will automatically test and reload Nginx.

---

## Step 6: Configure Supabase Allowed Origins

1. Log into your Supabase project dashboard.
2. Go to **Authentication** > **URL Configuration**.
3. Under **Redirect URLs**, add:
   - `https://juanet.cloud/**`
   - `https://www.juanet.cloud/**`
4. Under **Site URL**, set:
   - `https://juanet.cloud`

---

## Step 7: Post-Deployment Verification Checklist

Execute these checks after every deployment:

1. [ ] **Direct Navigation**: Visit `https://juanet.cloud/services/web-development` and press refresh. Verify the page reloads cleanly without an Nginx 404.
2. [ ] **Asset Caching**: Open DevTools Network tab; verify CSS and JS files load with `200` / `304` and correct MIME types.
3. [ ] **Missing Asset 404**: Request a non-existent asset (`/missing-file.png`). Verify it returns a genuine 404, **not** `index.html`.
4. [ ] **SSL Validity**: Check browser lock icon for valid Let's Encrypt TLS certificate.
5. [ ] **Form Submission**: Submit a test inquiry via `/contact` or `/request-service`. Verify that a valid reference code (`JN-XXX-2026-XXXX`) is displayed and the record is stored in Supabase.
6. [ ] **Responsive Design**: Verify layout on mobile viewport and desktop viewport (1440px).

---

## Step 8: Rollback Procedure

To roll back quickly in case of an issue:

1. Maintain versioned release directories on the server:
   ```bash
   /home/juanet/htdocs/releases/20261013-01/
   /home/juanet/htdocs/releases/20261013-02/
   ```
2. Symlink `juanet.cloud` to the active release:
   ```bash
   ln -sfn /home/juanet/htdocs/releases/20261013-01 /home/juanet/htdocs/juanet.cloud
   ```
3. To roll back, simply re-point the symlink to the previous release folder:
   ```bash
   ln -sfn /home/juanet/htdocs/releases/20261013-01 /home/juanet/htdocs/juanet.cloud
   ```
