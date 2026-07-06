import { db } from '@/lib/db';

export async function GET() {
  try {
    // Count actionable items for admin
    const [pendingOrders, lowStock, pendingInquiries, pendingEnrollments] = await Promise.all([
      db.execute(`SELECT COUNT(*) as count FROM orders WHERE LOWER(status) = 'pending'`),
      db.execute(`SELECT COUNT(*) as count FROM products WHERE stock > 0 AND stock <= 20`),
      db.execute(`SELECT COUNT(*) as count FROM service_inquiries WHERE LOWER(status) = 'pending'`),
      db.execute(`SELECT COUNT(*) as count FROM enrollments WHERE progress < 100`),
    ]);

    const total = Number((pendingOrders.rows[0] as any)?.count ?? 0) +
                  Number((lowStock.rows[0] as any)?.count ?? 0) +
                  Number((pendingInquiries.rows[0] as any)?.count ?? 0);

    const notifications = [
      ...(Number((pendingOrders.rows[0] as any)?.count ?? 0) > 0
        ? [{ type: 'order', message: `${(pendingOrders.rows[0] as any).count} pending orders`, link: '/admin/orders' }]
        : []),
      ...(Number((lowStock.rows[0] as any)?.count ?? 0) > 0
        ? [{ type: 'stock', message: `${(lowStock.rows[0] as any).count} products low on stock`, link: '/admin/inventory' }]
        : []),
      ...(Number((pendingInquiries.rows[0] as any)?.count ?? 0) > 0
        ? [{ type: 'inquiry', message: `${(pendingInquiries.rows[0] as any).count} pending service inquiries`, link: '/admin/service-inq' }]
        : []),
    ];

    return Response.json({ total, notifications });
  } catch (e) {
    console.error('[GET /api/notifications]', e);
    return Response.json({ total: 0, notifications: [] });
  }
}
