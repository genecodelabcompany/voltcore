/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '@/lib/db';

export interface OrderRow {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  city: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_ref: string | null;
  payment_method: string;
  shipping_method: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  item_count?: number;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  name: string;
  price: number;
  qty: number;
}

export interface OrderFilters {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function getOrders(filters: OrderFilters = {}): Promise<{ rows: OrderRow[]; total: number }> {
  const conditions: string[] = [];
  const args: any[] = [];

  if (filters.status && filters.status !== 'all') {
    conditions.push('o.status = ?');
    args.push(filters.status);
  }
  if (filters.search) {
    conditions.push('(o.id LIKE ? OR o.customer_name LIKE ? OR o.customer_email LIKE ?)');
    const q = `%${filters.search}%`;
    args.push(q, q, q);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await db.execute({
    sql: `SELECT COUNT(*) as total FROM orders o ${where}`,
    args,
  });
  const total = Number((countResult.rows[0] as Record<string, unknown>)?.total ?? 0);

  const limit = filters.limit ?? 100;
  const offset = filters.offset ?? 0;

  const dataResult = await db.execute({
    sql: `SELECT o.*, COUNT(oi.id) as item_count
          FROM orders o
          LEFT JOIN order_items oi ON oi.order_id = o.id
          ${where}
          GROUP BY o.id
          ORDER BY o.created_at DESC
          LIMIT ? OFFSET ?`,
    args: [...args, limit, offset],
  });

  return { rows: dataResult.rows as unknown as OrderRow[], total };
}

export async function getOrderById(id: string): Promise<(OrderRow & { items: OrderItemRow[] }) | null> {
  const orderResult = await db.execute({
    sql: 'SELECT * FROM orders WHERE id = ?',
    args: [id],
  });
  if (!orderResult.rows[0]) return null;

  const order = orderResult.rows[0] as unknown as OrderRow;
  const itemsResult = await db.execute({
    sql: 'SELECT * FROM order_items WHERE order_id = ?',
    args: [id],
  });
  return { ...order, items: itemsResult.rows as unknown as OrderItemRow[] };
}

export async function createOrder(data: {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  city: string;
  amount: number;
  payment_ref?: string;
  payment_method?: string;
  shipping_method?: string;
  notes?: string;
  items: { product_id: string; name: string; price: number; qty: number }[];
}): Promise<string> {
  await db.execute({
    sql: `INSERT INTO orders
          (id, customer_name, customer_email, customer_phone, address, city, amount,
           payment_ref, payment_method, shipping_method, notes, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    args: [
      data.id, data.customer_name, data.customer_email, data.customer_phone,
      data.address, data.city, data.amount,
      data.payment_ref ?? null,
      data.payment_method ?? 'paystack',
      data.shipping_method ?? 'standard',
      data.notes ?? null,
    ],
  });

  for (const item of data.items) {
    const { randomUUID } = await import('crypto');
    await db.execute({
      sql: `INSERT INTO order_items (id, order_id, product_id, name, price, qty)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [randomUUID(), data.id, item.product_id, item.name, item.price, item.qty],
    });
    // Decrement stock
    await db.execute({
      sql: `UPDATE products SET stock = MAX(0, stock - ?), sold = sold + ? WHERE id = ?`,
      args: [item.qty, item.qty, item.product_id],
    });
  }

  return data.id;
}

export async function updateOrderStatus(
  id: string,
  status: OrderRow['status'],
  payment_ref?: string
): Promise<void> {
  await db.execute({
    sql: `UPDATE orders SET status = ?, updated_at = datetime('now')
          ${payment_ref ? ', payment_ref = ?' : ''} WHERE id = ?`,
    args: payment_ref ? [status, payment_ref, id] : [status, id],
  });
}

export async function getOrderStats(): Promise<{
  total: number; pending: number; processing: number;
  shipped: number; delivered: number; cancelled: number;
  revenue: number; avg_order: number;
}> {
  const result = await db.execute(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending'    THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing,
      SUM(CASE WHEN status = 'shipped'    THEN 1 ELSE 0 END) as shipped,
      SUM(CASE WHEN status = 'delivered'  THEN 1 ELSE 0 END) as delivered,
      SUM(CASE WHEN status = 'cancelled'  THEN 1 ELSE 0 END) as cancelled,
      COALESCE(SUM(amount), 0) as revenue,
      COALESCE(AVG(amount), 0) as avg_order
    FROM orders
  `);
  const row = result.rows[0] as unknown as Record<string, number>;
  return {
    total: row.total ?? 0, pending: row.pending ?? 0,
    processing: row.processing ?? 0, shipped: row.shipped ?? 0,
    delivered: row.delivered ?? 0, cancelled: row.cancelled ?? 0,
    revenue: row.revenue ?? 0, avg_order: row.avg_order ?? 0,
  };
}
