# COSMO Atelier // Client Handover & Production Operations Guide

Welcome to the **COSMO Authorized Apple Reseller & Electronics Atelier** web platform. This document provides complete instructions for store owners, administrative managers, and technical operators to run, configure, and deploy the application.

---

## 1. Executive Summary & Credentials

| Credential / Setting | Value | Notes |
|---|---|---|
| **Admin Portal URL** | `/admin` or `/admin/login` | Edge-secured administrative dashboard |
| **Default Vault Master PIN** | `2026` | Configurable in `.env` via `ADMIN_SECRET_KEY` |
| **Owner Session Cookie** | `cosmo_admin_session` | Encrypted HttpOnly 7-day session token |
| **Live Storefront URL (Local)** | `http://localhost:3000` | Active Next.js development server |
| **Default Courier Security PIN** | Dynamic 4-digit code | Generated per order and dispatched in HTML receipt |

---

## 2. Platform Architecture

The COSMO platform is engineered using enterprise-grade architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                   COSMO STOREFRONT                          │
│  Next.js 16 (Turbopack) · React 19 · Tailwind CSS v4       │
├─────────────────────────────────────────────────────────────┤
│  • Lookbook & Dynamic Swatch Switcher (81 Official Assets)  │
│  • Device Comparison Modal (Side-by-side specs)             │
│  • Smart 3-Item Accessory Bundles (10% Dynamic Discount)    │
│  • Trade-In Calculator & Instant Checkout Voucher           │
│  • Serial Number & Warranty Coverage Checker                │
│  • Bespoke Laser Engraving Studio Visualizer                │
├─────────────────────────────────────────────────────────────┤
│                 EDGE SECURITY & MIDDLEWARE                  │
│  • OWASP Security Headers (HSTS, NoSniff, SameOrigin)       │
│  • Passkey-Guarded Admin Edge Gate (/admin)                 │
├─────────────────────────────────────────────────────────────┤
│                 ENTERPRISE COMMERCE ENGINE                  │
│  • Zero-Trust Price Recalculation (src/lib/server-pricing)  │
│  • Zod Runtime Data Boundaries (src/lib/validations)        │
│  • ACID Concurrency & Atomic Stock Decrements (Prisma)      │
│  • Stripe Webhook Deduplication Ledger & Fast-ACK           │
├─────────────────────────────────────────────────────────────┤
│                 DATABASE & PRODUCTION APIS                  │
│  • Prisma ORM (Order, OrderItem, Coupon, InventoryRecord)   │
│  • Stripe Dual-Mode (Live Checkout / Smart Simulator)       │
│  • Resend / SMTP Transactional HTML Email Dispatch          │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Production Environment Variables (`.env`)

To switch from simulated development mode to live commercial operation processing real credit cards, copy `.env.example` to `.env` and fill in your merchant credentials:

```bash
# ==============================================================================
# 1. DATABASE
# ==============================================================================
# Local development uses SQLite:
DATABASE_URL="file:./dev.db"

# For Serverless Cloud Deployment (Neon, Supabase, Prisma Postgres):
# DATABASE_URL="postgresql://user:password@ep-host.pooler.region.neon.tech/neondb?sslmode=require"

# ==============================================================================
# 2. STRIPE PAYMENT GATEWAY
# ==============================================================================
# Retrieve from Stripe Dashboard -> Developers -> API Keys:
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Webhook Secret from Stripe Dashboard -> Developers -> Webhooks:
STRIPE_WEBHOOK_SECRET="whsec_..."

# ==============================================================================
# 3. TRANSACTIONAL RECEIPT EMAILS (Resend)
# ==============================================================================
# Retrieve from https://resend.com/api-keys:
RESEND_API_KEY="re_..."
EMAIL_FROM="COSMO Atelier Concierge <orders@yourdomain.com>"

# ==============================================================================
# 4. STORE OWNER & SECURITY
# ==============================================================================
ADMIN_SECRET_KEY="2026"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

---

## 4. Cloud Deployment Options

### Option A: Cloudflare Deployment (Pages & Workers)
Since you use Cloudflare on your workstation, you can deploy the site with maximum speed across Cloudflare's global edge network:

1. **Via Cloudflare Dashboard (Recommended)**:
   - Push your Git repository to **GitHub** or **GitLab**.
   - Open your **Cloudflare Dashboard** -> **Compute (Workers & Pages)** -> **Create application** -> **Pages**.
   - Select **Connect to Git** and choose the `apple_store` repository.
   - Build Settings:
     - Framework preset: `Next.js`
     - Build command: `npm run build`
     - Build output directory: `.next`
   - Add your environment variables in the Cloudflare dashboard.

2. **Via Cloudflare Tunnel (Instant Live Demo without Hosting Setup)**:
   If you want to immediately showcase the running site from your laptop to a live public URL with free SSL:
   ```powershell
   npx cloudflared tunnel --url http://localhost:3000
   ```
   Cloudflare will output a public URL (e.g. `https://xxxx.trycloudflare.com`) that you can open on any phone or send to your client instantly.

### Option B: Vercel Deployment
Next.js is natively developed by Vercel:
1. Push repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the repository and paste your `.env` variables.
4. Click **Deploy**.

---

## 5. Daily Store Management Guide (`/admin`)

The **Owner Command Center** gives store operators full control:

### 1. Real-Time Order Management
- View all central database orders with live customer contact, address, delivery type, and items.
- Filter orders by status: `Vault Allocated`, `Payment Verified`, `Courier Dispatched`, `Delivered`.
- Assign official couriers, vehicles, and delivery ETAs.
- Advancing order status automatically updates the customer's live tracking view.

### 2. Inventory & Finish Stock
- Toggle devices In-Stock or Sold-Out with a single click.
- Adjust per-color stock levels.
- Automated Low-Stock warning ribbon alerts when any finish drops to 3 units or fewer.
- Quick `+10 Restock` button instantly replenishes inventory.

### 3. Promo Codes & Trade-In Vouchers
- Create percentage or fixed USD discount coupons.
- Configure minimum spend limits, expiration dates, and maximum usage counters.
- View real-time coupon redemption tracking.

### 4. Sales & Analytics
- Live Gross Revenue KPI.
- Average Order Value (AOV) calculator.
- AppleCare+ attachment rate metrics.
- Top-performing models and finish distribution charts.

---

## 6. Automated Verification Test Suite

Before making major deployments or updating code, execute the automated hardening verification test suite:

```powershell
node test_enterprise_hardening.js
```

This tests and confirms:
1. **Price Tampering Defense**: Rejection of manipulated client pricing.
2. **Input Boundaries**: Rejection of negative quantities or unit overflows.
3. **Webhook Idempotency**: Interception of duplicate gateway webhook events.
4. **Passkey Security**: Denial of unauthorized requests to admin endpoints.
5. **Order Lifecycle**: Successful status patching and courier allocation.
6. **SEO Governance**: Valid `robots.txt` and `sitemap.xml` feeds.

---

*COSMO Luxury Electronics Atelier · Engineered for Enterprise Reliability.*
