// ═══════════════════════════════════════════════════════════
//  src/lib/db.ts — Cloudflare D1 query helpers
// ═══════════════════════════════════════════════════════════
import type { Artwork, ArtworkImage, Client, Order, OrderItem, AnalyticsSummary } from '@/types'

// ─── ARTWORKS ───────────────────────────────────────────────────────────────

export async function getArtworks(
  db: D1Database,
  opts: { status?: string; featured?: boolean; series?: string } = {}
): Promise<Artwork[]> {
  let query = 'SELECT * FROM artworks'
  const conditions: string[] = []
  const params: unknown[] = []

  if (opts.status) { conditions.push('status = ?'); params.push(opts.status) }
  if (opts.featured !== undefined) { conditions.push('featured = ?'); params.push(opts.featured ? 1 : 0) }
  if (opts.series) { conditions.push('series = ?'); params.push(opts.series) }

  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ')
  query += ' ORDER BY sort_order ASC, id ASC'

  const { results } = await db.prepare(query).bind(...params).all<Artwork>()
  return results
}

export async function getArtworkBySlug(db: D1Database, slug: string): Promise<Artwork | null> {
  const artwork = await db.prepare('SELECT * FROM artworks WHERE slug = ?').bind(slug).first<Artwork>()
  if (!artwork) return null

  const { results: images } = await db
    .prepare('SELECT * FROM artwork_images WHERE artwork_id = ? ORDER BY sort_order ASC')
    .bind(artwork.id)
    .all<ArtworkImage>()

  return { ...artwork, images }
}

export async function getArtworkById(db: D1Database, id: number): Promise<Artwork | null> {
  const artwork = await db.prepare('SELECT * FROM artworks WHERE id = ?').bind(id).first<Artwork>()
  if (!artwork) return null

  const { results: images } = await db
    .prepare('SELECT * FROM artwork_images WHERE artwork_id = ? ORDER BY sort_order ASC')
    .bind(artwork.id)
    .all<ArtworkImage>()

  return { ...artwork, images }
}

export async function createArtwork(db: D1Database, data: Partial<Artwork>): Promise<{ id: number }> {
  const result = await db.prepare(`
    INSERT INTO artworks (title, slug, year, medium, dimensions, description, series, price, status, featured, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    data.title, data.slug, data.year ?? null, data.medium,
    data.dimensions, data.description ?? null, data.series ?? null,
    data.price, data.status ?? 'available', data.featured ?? 0, data.sort_order ?? 0
  ).run()
  return { id: result.meta.last_row_id as number }
}

export async function updateArtwork(db: D1Database, id: number, data: Partial<Artwork>): Promise<void> {
  await db.prepare(`
    UPDATE artworks SET title=?, slug=?, year=?, medium=?, dimensions=?, description=?,
    series=?, price=?, status=?, featured=?, sort_order=?, updated_at=datetime('now')
    WHERE id=?
  `).bind(
    data.title, data.slug, data.year ?? null, data.medium,
    data.dimensions, data.description ?? null, data.series ?? null,
    data.price, data.status, data.featured ?? 0, data.sort_order ?? 0, id
  ).run()
}

export async function deleteArtwork(db: D1Database, id: number): Promise<void> {
  await db.prepare('DELETE FROM artworks WHERE id = ?').bind(id).run()
}

export async function addArtworkImage(
  db: D1Database,
  artworkId: number,
  r2Key: string,
  isPrimary = false
): Promise<void> {
  if (isPrimary) {
    await db.prepare('UPDATE artwork_images SET is_primary = 0 WHERE artwork_id = ?').bind(artworkId).run()
  }
  await db.prepare(`
    INSERT INTO artwork_images (artwork_id, r2_key, is_primary, sort_order)
    VALUES (?, ?, ?, (SELECT COALESCE(MAX(sort_order),0)+1 FROM artwork_images WHERE artwork_id=?))
  `).bind(artworkId, r2Key, isPrimary ? 1 : 0, artworkId).run()
}

// ─── CLIENTS ────────────────────────────────────────────────────────────────

export async function getClients(db: D1Database): Promise<Client[]> {
  const { results } = await db.prepare(`
    SELECT c.*,
      COUNT(DISTINCT o.id) AS order_count,
      COALESCE(SUM(o.total), 0) AS total_spent
    FROM clients c
    LEFT JOIN orders o ON o.client_id = c.id AND o.status NOT IN ('cancelled','refunded')
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `).all<Client>()
  return results.map(c => ({
    ...c,
    shipping_address: c.shipping_address ? JSON.parse(c.shipping_address as unknown as string) : null
  }))
}

export async function getOrCreateClient(
  db: D1Database,
  data: { first_name: string; last_name: string; email: string; phone?: string; shipping_address?: object }
): Promise<{ id: number }> {
  const existing = await db.prepare('SELECT id FROM clients WHERE email = ?').bind(data.email).first<{ id: number }>()
  if (existing) {
    await db.prepare(`UPDATE clients SET first_name=?, last_name=?, phone=?, shipping_address=?, updated_at=datetime('now') WHERE email=?`)
      .bind(data.first_name, data.last_name, data.phone ?? null, data.shipping_address ? JSON.stringify(data.shipping_address) : null, data.email)
      .run()
    return existing
  }
  const result = await db.prepare(`
    INSERT INTO clients (first_name, last_name, email, phone, shipping_address)
    VALUES (?, ?, ?, ?, ?)
  `).bind(data.first_name, data.last_name, data.email, data.phone ?? null,
    data.shipping_address ? JSON.stringify(data.shipping_address) : null).run()
  return { id: result.meta.last_row_id as number }
}

// ─── ORDERS ─────────────────────────────────────────────────────────────────

export async function getOrders(db: D1Database, status?: string): Promise<Order[]> {
  let query = `
    SELECT o.*, c.first_name, c.last_name, c.email
    FROM orders o LEFT JOIN clients c ON c.id = o.client_id
  `
  const params: unknown[] = []
  if (status) { query += ' WHERE o.status = ?'; params.push(status) }
  query += ' ORDER BY o.created_at DESC'

  const { results } = await db.prepare(query).bind(...params).all()
  return results.map((r: Record<string, unknown>) => ({
    ...(r as Order),
    shipping_address: r.shipping_address ? JSON.parse(r.shipping_address as string) : null,
    client: r.email ? { first_name: r.first_name, last_name: r.last_name, email: r.email } : null,
  })) as Order[]
}

export async function getOrderById(db: D1Database, id: number): Promise<Order | null> {
  const order = await db.prepare(`
    SELECT o.*, c.first_name, c.last_name, c.email, c.phone
    FROM orders o LEFT JOIN clients c ON c.id = o.client_id
    WHERE o.id = ?
  `).bind(id).first<Record<string, unknown>>()
  if (!order) return null

  const { results: items } = await db
    .prepare('SELECT oi.*, ai.r2_key FROM order_items oi LEFT JOIN artwork_images ai ON ai.artwork_id = oi.artwork_id AND ai.is_primary=1 WHERE oi.order_id = ?')
    .bind(id).all<OrderItem>()

  return {
    ...order as unknown as Order,
    shipping_address: order.shipping_address ? JSON.parse(order.shipping_address as string) : null,
    client: order.email ? {
      id: order.client_id as number, first_name: order.first_name as string,
      last_name: order.last_name as string, email: order.email as string,
      phone: order.phone as string | null, shipping_address: null, notes: null,
      created_at: '', updated_at: ''
    } : null,
    items,
  }
}

export async function createOrder(
  db: D1Database,
  data: {
    client_id: number | null
    items: { artwork_id: number; title: string; price: number; quantity: number }[]
    shipping_address: object
    shipping_cost?: number
    notes?: string
  }
): Promise<{ id: number; order_number: string }> {
  const subtotal = data.items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping_cost = data.shipping_cost ?? 0
  const total = subtotal + shipping_cost

  // Generate order number: CC-YYYY-NNNN
  const year = new Date().getFullYear()
  const countResult = await db.prepare("SELECT COUNT(*) as c FROM orders WHERE order_number LIKE ?").bind(`CC-${year}-%`).first<{ c: number }>()
  const orderNumber = `CC-${year}-${String((countResult?.c ?? 0) + 1).padStart(4, '0')}`

  const result = await db.prepare(`
    INSERT INTO orders (order_number, client_id, status, subtotal, shipping_cost, total, shipping_address, notes)
    VALUES (?, ?, 'pending', ?, ?, ?, ?, ?)
  `).bind(orderNumber, data.client_id, subtotal, shipping_cost, total,
    JSON.stringify(data.shipping_address), data.notes ?? null).run()

  const orderId = result.meta.last_row_id as number

  for (const item of data.items) {
    await db.prepare(`
      INSERT INTO order_items (order_id, artwork_id, title, price, quantity)
      VALUES (?, ?, ?, ?, ?)
    `).bind(orderId, item.artwork_id, item.title, item.price, item.quantity).run()

    // Mark artwork as reserved
    await db.prepare("UPDATE artworks SET status='reserved' WHERE id=?").bind(item.artwork_id).run()
  }

  return { id: orderId, order_number: orderNumber }
}

export async function updateOrderStatus(db: D1Database, id: number, status: string): Promise<void> {
  await db.prepare("UPDATE orders SET status=?, updated_at=datetime('now') WHERE id=?").bind(status, id).run()
  if (status === 'paid' || status === 'delivered') {
    await db.prepare(`
      UPDATE artworks SET status='sold', updated_at=datetime('now')
      WHERE id IN (SELECT artwork_id FROM order_items WHERE order_id=?)
    `).bind(id).run()
  }
  if (status === 'cancelled') {
    await db.prepare(`
      UPDATE artworks SET status='available', updated_at=datetime('now')
      WHERE id IN (SELECT artwork_id FROM order_items WHERE order_id=?)
    `).bind(id).run()
  }
}

// ─── ANALYTICS ──────────────────────────────────────────────────────────────

export async function getAnalytics(db: D1Database): Promise<AnalyticsSummary> {
  const [revenue, artworkCounts, clientCount, topArtworks, recentOrders] = await Promise.all([
    db.prepare(`
      SELECT
        COALESCE(SUM(CASE WHEN status NOT IN ('cancelled','refunded') THEN total ELSE 0 END), 0) AS total_revenue,
        COUNT(*) AS total_orders,
        SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) AS orders_pending,
        SUM(CASE WHEN status='paid' THEN 1 ELSE 0 END) AS orders_paid
      FROM orders
    `).first<{ total_revenue: number; total_orders: number; orders_pending: number; orders_paid: number }>(),

    db.prepare(`
      SELECT COUNT(*) AS total_artworks,
        SUM(CASE WHEN status='available' THEN 1 ELSE 0 END) AS artworks_available,
        SUM(CASE WHEN status='sold' THEN 1 ELSE 0 END) AS artworks_sold
      FROM artworks
    `).first<{ total_artworks: number; artworks_available: number; artworks_sold: number }>(),

    db.prepare('SELECT COUNT(*) AS c FROM clients').first<{ c: number }>(),

    db.prepare(`
      SELECT a.title, COUNT(oi.id) AS total_sold, SUM(oi.price) AS revenue
      FROM order_items oi JOIN artworks a ON a.id = oi.artwork_id
      JOIN orders o ON o.id = oi.order_id WHERE o.status NOT IN ('cancelled','refunded')
      GROUP BY a.id ORDER BY total_sold DESC LIMIT 5
    `).all<{ title: string; total_sold: number; revenue: number }>(),

    db.prepare(`
      SELECT o.*, c.first_name, c.last_name FROM orders o
      LEFT JOIN clients c ON c.id = o.client_id
      ORDER BY o.created_at DESC LIMIT 5
    `).all<Record<string, unknown>>(),
  ])

  return {
    total_revenue: revenue?.total_revenue ?? 0,
    total_orders: revenue?.total_orders ?? 0,
    orders_pending: revenue?.orders_pending ?? 0,
    orders_paid: revenue?.orders_paid ?? 0,
    total_artworks: artworkCounts?.total_artworks ?? 0,
    artworks_available: artworkCounts?.artworks_available ?? 0,
    artworks_sold: artworkCounts?.artworks_sold ?? 0,
    total_clients: clientCount?.c ?? 0,
    top_artworks: topArtworks.results,
    recent_orders: recentOrders.results as unknown as Order[],
  }
}
