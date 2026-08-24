-- supabase-print-orders.sql
--
-- Run this once in your Supabase project's SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run).
--
-- Adds:
--   1. `print_options` column on the existing `paintings` table, so each
--      work can define its own print sizes/prices. Leave it null/empty on
--      any painting to use the studio-wide default ladder defined in
--      src/lib/paintings.ts (defaultPrintOptions).
--   2. A new `print_orders` table to store print purchases. Orders are
--      also emailed to the studio at checkout regardless of whether this
--      table exists, so the site works even before you run this — but
--      running it gives you a durable, cross-device order history and
--      powers the /admin/orders screen.

-- 1. Per-painting print options (nullable — falls back to defaults)
alter table paintings
  add column if not exists print_options jsonb default '[]'::jsonb;

-- Example of setting a custom print ladder for one painting:
--   update paintings
--   set print_options = '[
--     {"id":"digital","format":"Digital Download","size":"High-res digital file","price":45},
--     {"id":"canvas-24x30","format":"Canvas Print","size":"24 × 30 in","price":350}
--   ]'::jsonb
--   where slug = 'threshold-of-returning-light';

-- 2. Print orders
create table if not exists print_orders (
  id bigint generated always as identity primary key,
  order_number text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address jsonb,           -- null when the order is digital-only
  items jsonb not null,             -- array of PrintOrderItem (see src/lib/orders.ts)
  subtotal numeric not null,
  shipping_cost numeric not null default 0,
  total numeric not null,
  status text not null default 'pending'
    check (status in ('pending','confirmed','in_production','shipped','delivered','cancelled')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists print_orders_created_at_idx on print_orders (created_at desc);
create index if not exists print_orders_status_idx on print_orders (status);

-- Row Level Security: lock the table down entirely. All access goes
-- through the server-side service-role key (in /api/print-orders and the
-- /admin/orders screen), never through the public anon key — order rows
-- contain customer names, emails and shipping addresses.
alter table print_orders enable row level security;
-- (No policies are added — with RLS on and no policies, the anon/public
-- key has zero access, while the service-role key bypasses RLS entirely
-- as it always does in Supabase. This is intentional.)
