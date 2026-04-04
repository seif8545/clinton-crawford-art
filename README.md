# Clinton Crawford Art — Full Stack Artist Portfolio

A production-ready e-commerce website and admin dashboard for **Dr. Clinton Crawford**, painter of magical realism. Built with Next.js 14 (App Router), deployed to Cloudflare Pages, with Cloudflare D1 (SQLite) for the database and Cloudflare R2 for artwork image storage.

---

## 🎨 Design System — Palette Extracted from the Painting

Colors were pulled directly from *"Portals to Other Dimensions"* (Acrylic on Canvas).

| Token | Hex | Source in Painting | Usage |
|---|---|---|---|
| `void` | `#1C1018` | Dark cave corner / deep background | Page background |
| `surface` | `#221018` | Slightly lifted cave wall | Cards, panels |
| `border` | `#3D1A28` | Subtle rock shadow | Dividers, borders |
| `nebula` | `#7B1D2E` | Crimson nebula sky (top right) | Primary brand red |
| `mauve` | `#B87585` | Dusty rose cave walls | Secondary text |
| `celestial` | `#A9BDD6` | Periwinkle sky blue | Cool accents |
| `cobalt` | `#3D4F8A` | Indigo foliage in midground | Deep blue accent |
| `gold` | `#C9A227` | Gilded frame + comet streak | CTAs, prices, luxury accent |
| `ivory` | `#F2E8D9` | Waterfall + light areas | Body text, headings |
| `ember` | `#D46828` | Orange sphere (foreground) | Warm CTA, pending states |

**Typography:**
- **Display** — *Cormorant Garamond* — elegant, old-world, painterly
- **Body** — *Lora* — readable serif with warmth
- **Mono** — *JetBrains Mono* — admin order numbers, code

---

## 📁 Project Structure

```
clinton-crawford-art/
├── .github/workflows/deploy.yml    # Auto-deploy to Cloudflare Pages
├── public/placeholder-artwork.svg  # Dev placeholder image
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout + font loading
│   │   ├── page.tsx                # Home / landing page
│   │   ├── not-found.tsx           # 404 "Portal Not Found"
│   │   ├── gallery/page.tsx        # Artwork grid with filters
│   │   ├── artwork/[id]/page.tsx   # Artwork detail + Add to Cart
│   │   ├── about/page.tsx          # Full artist biography
│   │   ├── cart/page.tsx           # Shopping cart
│   │   ├── checkout/page.tsx       # Checkout (Stripe-ready)
│   │   ├── checkout/success/       # Order confirmation
│   │   ├── admin/
│   │   │   ├── layout.tsx          # Protected shell
│   │   │   ├── login/page.tsx      # Password login
│   │   │   ├── page.tsx            # Analytics dashboard
│   │   │   ├── inventory/page.tsx  # Add/edit/delete artworks + R2 upload
│   │   │   ├── orders/page.tsx     # Order management + status flow
│   │   │   └── clients/page.tsx    # Collector CRM
│   │   └── api/
│   │       ├── artworks/route.ts          # GET all, POST new
│   │       ├── artworks/[id]/route.ts     # GET one, PATCH, DELETE
│   │       ├── orders/route.ts            # GET all, POST new
│   │       ├── orders/[id]/route.ts       # GET one, PATCH status
│   │       ├── clients/route.ts           # GET all
│   │       ├── upload/route.ts            # POST image to R2
│   │       └── admin/login/route.ts       # POST login, DELETE logout
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ArtworkCard.tsx
│   │   ├── AddToCartButton.tsx
│   │   ├── CartProvider.tsx        # Zustand cart (persisted)
│   │   └── admin/AdminNav.tsx
│   ├── lib/
│   │   ├── db.ts                   # All D1 query helpers
│   │   └── r2.ts                   # R2 upload/delete helpers
│   └── types/index.ts              # Shared TypeScript interfaces
├── schema.sql                      # D1 schema + seed artworks
├── wrangler.toml                   # Cloudflare D1 + R2 bindings
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── .dev.vars.example               # Local secrets template
```

---

## 🚀 Setup — Step by Step

### Prerequisites
- Node.js 20+
- A Cloudflare account (free tier works)
- A GitHub account

---

### Step 1 — Install Dependencies

```bash
# Enter your project directory
cd clinton-crawford-art

# Install all packages
npm install

# Copy secrets template
cp .dev.vars.example .dev.vars
# Edit .dev.vars and set ADMIN_PASSWORD to anything you choose
```

---

### Step 2 — Create Cloudflare D1 Database

```bash
# Authenticate with Cloudflare
npx wrangler login

# Create the database
npx wrangler d1 create artist-db
# OUTPUT: database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# Paste that database_id into wrangler.toml under [[d1_databases]]

# Initialize schema and seed data
npm run db:init:local    # local dev
npm run db:init:remote   # production (run once before first deploy)
```

---

### Step 3 — Create Cloudflare R2 Bucket

```bash
# Create the bucket
npx wrangler r2 bucket create artist-artwork
```

Then enable public access:
1. Go to **dash.cloudflare.com → R2**
2. Click **artist-artwork → Settings → Public Access → Allow Access**
3. Copy the public URL — it looks like `https://pub-HASH.r2.dev`
4. Add to `.dev.vars`: `R2_PUBLIC_URL=https://pub-YOURHASH.r2.dev`
5. Add to production: `npx wrangler secret put R2_PUBLIC_URL`

---

### Step 4 — Set Production Secrets

```bash
npx wrangler secret put ADMIN_PASSWORD
# Type your admin password when prompted

npx wrangler secret put ADMIN_SECRET_KEY
# Type any random 32+ character string

npx wrangler secret put R2_PUBLIC_URL
# Paste your R2 public bucket URL
```

---

### Step 5 — Run Locally

```bash
# Fast Next.js dev (UI works, DB/R2 calls fall back gracefully)
npm run dev
# → http://localhost:3000

# Full Cloudflare preview (real D1 + R2 bindings)
npm run preview
# → http://localhost:8788
```

---

### Step 6 — Deploy to Cloudflare Pages

```bash
# First-time manual deploy (creates the Pages project)
npm run deploy
```

---

### Step 7 — Connect GitHub for Auto-Deploy

```bash
git init
git add .
git commit -m "Initial commit — Clinton Crawford Art"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/clinton-crawford-art.git
git push -u origin main
```

Add GitHub secrets at **repo → Settings → Secrets → Actions**:

| Secret | Where to get it |
|---|---|
| `CLOUDFLARE_API_TOKEN` | dash.cloudflare.com → My Profile → API Tokens → "Edit Cloudflare Workers" |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard homepage → right sidebar |

Every push to `main` now auto-builds and deploys.

---

## 💳 Stripe Integration (Go Live)

Checkout is simulated by default. To accept real payments:

```bash
npm install stripe @stripe/stripe-js
npx wrangler secret put STRIPE_SECRET_KEY
```

In `src/app/api/orders/route.ts`, after `createOrder(...)`:

```typescript
import Stripe from 'stripe'
const stripe = new Stripe(env.STRIPE_SECRET_KEY)
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(total * 100), // in cents
  currency: 'usd',
  metadata: { order_number },
})
// Return clientSecret to the frontend, use <PaymentElement> to collect card
```

---

## 👑 Admin Panel — `/admin`

Login with your `ADMIN_PASSWORD`.

| Page | Path | Features |
|---|---|---|
| Analytics | `/admin` | Revenue, order counts, top works, recent orders |
| Inventory | `/admin/inventory` | Add/edit/delete artworks, upload photos to R2, mark sold/reserved |
| Orders | `/admin/orders` | All orders, filter by status, advance through pending→paid→shipped→delivered, cancel |
| Collectors | `/admin/clients` | Search clients, purchase history, shipping addresses, lifetime value |

---

## 🗄️ Database Schema

```sql
artworks        — title, slug, medium, dimensions, price, status, series, featured, sort_order
artwork_images  — r2_key, is_primary, sort_order (multiple photos per artwork)
clients         — first_name, last_name, email, phone, shipping_address (JSON)
orders          — order_number (CC-YYYY-NNNN), client_id, status, totals, shipping snapshot
order_items     — artwork_id, title/price snapshot at time of purchase
```

Order numbers auto-generate in the format `CC-2024-0001`.

---

## 🔧 Environment Variables

| Variable | Set in | Description |
|---|---|---|
| `ADMIN_PASSWORD` | Wrangler secret | Password for `/admin` |
| `ADMIN_SECRET_KEY` | Wrangler secret | Session cookie signing |
| `R2_PUBLIC_URL` | Wrangler secret | Public R2 base URL |
| `CLOUDFLARE_API_TOKEN` | GitHub secret | CI/CD deploy token |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub secret | CI/CD account ID |

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14, App Router, Edge Runtime |
| Styling | Tailwind CSS + CSS custom properties |
| Cart State | Zustand (persisted to localStorage) |
| Database | Cloudflare D1 (SQLite at the edge) |
| Image Storage | Cloudflare R2 |
| Hosting | Cloudflare Pages |
| CF Adapter | `` |
| CI/CD | GitHub Actions |
| Payments | Stripe-ready (simulated by default) |
| Fonts | Cormorant Garamond + Lora (Google Fonts) |

---

*"I have learnt to let go and not insist on controlling the outcome. It's the most liberating feeling one can experience." — Dr. Clinton Crawford*
