/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '@/lib/db';

export interface ProductRow {
  id: string;
  name: string;
  cat_id: string;
  price: number;
  was: number | null;
  sku: string;
  brand: string;
  badge: string | null;
  description: string;
  glyph: string;
  image_url: string | null;
  stock: number;
  sold: number;
  rating: number;
  reviews: number;
  status: 'published' | 'draft' | 'hidden';
  created_at: string;
  updated_at: string;
  // joined
  cat_name?: string;
  cat_color?: string;
  cat_icon?: string;
}

export interface ProductFilters {
  cat_id?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function getProducts(filters: ProductFilters = {}): Promise<{ rows: ProductRow[]; total: number }> {
  const conditions: string[] = [];
  const args: any[] = [];

  if (filters.cat_id) {
    conditions.push('p.cat_id = ?');
    args.push(filters.cat_id);
  }
  if (filters.status) {
    conditions.push('p.status = ?');
    args.push(filters.status);
  }
  if (filters.search) {
    conditions.push('(p.name LIKE ? OR p.brand LIKE ? OR p.sku LIKE ?)');
    const q = `%${filters.search}%`;
    args.push(q, q, q);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await db.execute({
    sql: `SELECT COUNT(*) as total FROM products p ${where}`,
    args,
  });
  const total = Number((countResult.rows[0] as Record<string, unknown>)?.total ?? 0);

  const limit = filters.limit ?? 100;
  const offset = filters.offset ?? 0;

  const dataResult = await db.execute({
    sql: `SELECT p.*, c.name as cat_name, c.color as cat_color, c.icon as cat_icon
          FROM products p
          LEFT JOIN categories c ON c.id = p.cat_id
          ${where}
          ORDER BY p.created_at DESC
          LIMIT ? OFFSET ?`,
    args: [...args, limit, offset],
  });

  return { rows: dataResult.rows as unknown as ProductRow[], total };
}

export async function getProductById(id: string): Promise<ProductRow | null> {
  const result = await db.execute({
    sql: `SELECT p.*, c.name as cat_name, c.color as cat_color, c.icon as cat_icon
          FROM products p
          LEFT JOIN categories c ON c.id = p.cat_id
          WHERE p.id = ?`,
    args: [id],
  });
  return (result.rows[0] as unknown as ProductRow) ?? null;
}

export async function createProduct(data: {
  id: string;
  name: string;
  cat_id: string;
  price: number;
  was?: number | null;
  sku: string;
  brand: string;
  badge?: string | null;
  description: string;
  glyph: string;
  image_url?: string | null;
  stock: number;
  status?: string;
}): Promise<void> {
  await db.execute({
    sql: `INSERT INTO products
          (id, name, cat_id, price, was, sku, brand, badge, description, glyph, image_url, stock, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      data.id, data.name, data.cat_id, data.price,
      data.was ?? null, data.sku, data.brand,
      data.badge ?? null, data.description, data.glyph,
      data.image_url ?? null, data.stock,
      data.status ?? 'published',
    ],
  });
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string; cat_id: string; price: number; was: number | null;
    sku: string; brand: string; badge: string | null; description: string;
    glyph: string; image_url: string | null; stock: number;
    sold: number; rating: number; reviews: number; status: string;
  }>
): Promise<void> {
  const fields = Object.keys(data);
  if (fields.length === 0) return;
  const set = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => (data as Record<string, any>)[f]);
  await db.execute({
    sql: `UPDATE products SET ${set}, updated_at = datetime('now') WHERE id = ?`,
    args: [...values, id],
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await db.execute({ sql: 'DELETE FROM products WHERE id = ?', args: [id] });
}

export async function getLowStockProducts(threshold = 20): Promise<ProductRow[]> {
  const result = await db.execute({
    sql: `SELECT p.*, c.name as cat_name FROM products p
          LEFT JOIN categories c ON c.id = p.cat_id
          WHERE p.stock <= ? AND p.status = 'published'
          ORDER BY p.stock ASC`,
    args: [threshold],
  });
  return result.rows as unknown as ProductRow[];
}

export async function getTopProducts(limit = 5): Promise<{ id: string; name: string; sold: number; revenue: number }[]> {
  const result = await db.execute({
    sql: `SELECT id, name, sold, (sold * price) as revenue
          FROM products ORDER BY sold DESC LIMIT ?`,
    args: [limit],
  });
  return result.rows as unknown as { id: string; name: string; sold: number; revenue: number }[];
}
