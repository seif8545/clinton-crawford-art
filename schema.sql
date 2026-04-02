-- ═══════════════════════════════════════════════════════════════════════════
--  Clinton Crawford Art — Cloudflare D1 Database Schema
--  Run: npm run db:init:local   (local dev)
--       npm run db:init:remote  (production)
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── ARTWORKS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS artworks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  slug        TEXT    NOT NULL UNIQUE,
  year        INTEGER,
  medium      TEXT    NOT NULL DEFAULT 'Acrylic on Canvas',
  dimensions  TEXT    NOT NULL,               -- e.g. "24 × 30 in"
  description TEXT,
  series      TEXT,                           -- e.g. "Portals to Other Dimensions"
  price       REAL    NOT NULL,
  status      TEXT    NOT NULL DEFAULT 'available' CHECK(status IN ('available','sold','reserved','not_for_sale')),
  featured    INTEGER NOT NULL DEFAULT 0,     -- boolean 0/1
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Artwork images (one artwork can have multiple photos)
CREATE TABLE IF NOT EXISTS artwork_images (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  artwork_id  INTEGER NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  r2_key      TEXT    NOT NULL,               -- R2 object key, e.g. "artworks/portal-1/main.jpg"
  is_primary  INTEGER NOT NULL DEFAULT 0,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- ─── CLIENTS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL UNIQUE,
  phone           TEXT,
  shipping_address TEXT,                      -- JSON: {line1, line2, city, state, zip, country}
  notes           TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── ORDERS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number    TEXT    NOT NULL UNIQUE,    -- e.g. "CC-2024-0001"
  client_id       INTEGER REFERENCES clients(id),
  status          TEXT    NOT NULL DEFAULT 'pending'
                    CHECK(status IN ('pending','paid','shipped','delivered','cancelled','refunded')),
  subtotal        REAL    NOT NULL DEFAULT 0,
  shipping_cost   REAL    NOT NULL DEFAULT 0,
  total           REAL    NOT NULL DEFAULT 0,
  shipping_address TEXT,                      -- snapshot of address at time of order
  stripe_payment_intent TEXT,                 -- for Stripe integration
  notes           TEXT,
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Order line items
CREATE TABLE IF NOT EXISTS order_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id    INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  artwork_id  INTEGER NOT NULL REFERENCES artworks(id),
  title       TEXT    NOT NULL,               -- snapshot of title at time of order
  price       REAL    NOT NULL,               -- snapshot of price at time of order
  quantity    INTEGER NOT NULL DEFAULT 1
);

-- ─── INDEXES ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_artworks_status   ON artworks(status);
CREATE INDEX IF NOT EXISTS idx_artworks_featured ON artworks(featured);
CREATE INDEX IF NOT EXISTS idx_artworks_slug     ON artworks(slug);
CREATE INDEX IF NOT EXISTS idx_orders_client     ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_status     ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_images_artwork    ON artwork_images(artwork_id);

-- ─── SEED DATA (demo artworks from "Portals to Other Dimensions" series) ────
INSERT OR IGNORE INTO artworks (title, slug, year, medium, dimensions, description, series, price, featured, sort_order)
VALUES
  (
    'Portal I — Land of Waters',
    'portal-i-land-of-waters',
    2023,
    'Acrylic on Canvas',
    '24 × 30 in (61 × 76 cm)',
    'A dreamscape where sky and water become interchangeable — the first portal in the series. The viewer stands at the threshold between the known world and an otherworldly consciousness, invited to cross.',
    'Portals to Other Dimensions',
    3800.00,
    1,
    1
  ),
  (
    'Portal II — Nebula Genesis',
    'portal-ii-nebula-genesis',
    2023,
    'Acrylic on Canvas',
    '24 × 30 in (61 × 76 cm)',
    'Celestial formations mirror earthly ones in this exploration of symbolic logic. The egg — a recurring symbol of life''s origin — anchors the composition against a crimson cosmic field.',
    'Portals to Other Dimensions',
    3800.00,
    1,
    2
  ),
  (
    'Portal III — Equatorial Light',
    'portal-iii-equatorial-light',
    2024,
    'Acrylic on Canvas',
    '30 × 36 in (76 × 91 cm)',
    'Light as only the equator knows it — dominating, transformative. This portal channels the vivid palette of Guyana''s Atlantic coast, where the artist''s lifelong relationship with color was born.',
    'Portals to Other Dimensions',
    4500.00,
    1,
    3
  ),
  (
    'Portal IV — Nile Passage',
    'portal-iv-nile-passage',
    2024,
    'Oil on Canvas',
    '36 × 48 in (91 × 122 cm)',
    'Informed by the artist''s travels to the Nile Valley, this portal draws on the classical African civilizations that have shaped his understanding of time, ritual, and the symbolic. Water flows upward here.',
    'Portals to Other Dimensions',
    6200.00,
    1,
    4
  ),
  (
    'Sunset Study — Atlantic Coast',
    'sunset-study-atlantic-coast',
    2019,
    'Oil on Canvas',
    '18 × 24 in (46 × 61 cm)',
    'From the artist''s early career — a lyrical seascape rooted in the coastline of his birthplace. The horizon line dissolves, as it always has, into something larger than itself.',
    'Early Works',
    2200.00,
    0,
    10
  ),
  (
    'Dreamscape No. 7 — Cloud Formation',
    'dreamscape-no-7-cloud-formation',
    2021,
    'Acrylic on Canvas',
    '20 × 24 in (51 × 61 cm)',
    'Atmospheric conditions assigned to imagined geographies. The cloud does not belong to any sky we know — it is borrowed from the uncensored interplay of dream consciousness and lived experience.',
    'Dreamscapes',
    2800.00,
    0,
    8
  );
