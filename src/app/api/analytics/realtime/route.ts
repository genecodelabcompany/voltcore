import { db } from '@/lib/db';

export async function GET() {
  try {
    const today = new Date().toISOString().slice(0, 10);

    // Today's stats
    const todayStats = await db.execute({
      sql: `SELECT
              COUNT(*) as orders_today,
              COALESCE(SUM(amount), 0) as revenue_today,
              COUNT(DISTINCT customer_email) as new_customers_today
            FROM orders
            WHERE date(created_at) = ?`,
      args: [today],
    });

    // Daily revenue for past 30 days
    const dailyRevenue = await db.execute({
      sql: `SELECT date(created_at) as day, COUNT(*) as orders, COALESCE(SUM(amount), 0) as revenue
            FROM orders
            WHERE created_at >= datetime('now', '-30 days')
            GROUP BY date(created_at)
            ORDER BY day ASC`,
    });

    // Hourly revenue for today
    const hourlyToday = await db.execute({
      sql: `SELECT strftime('%H', created_at) as hour, COUNT(*) as orders, COALESCE(SUM(amount), 0) as revenue
            FROM orders
            WHERE date(created_at) = date('now')
            GROUP BY strftime('%H', created_at)
            ORDER BY hour ASC`,
    });

    // Weekly revenue for past 12 weeks
    const weeklyRevenue = await db.execute({
      sql: `SELECT strftime('%Y-W%W', created_at) as week, COUNT(*) as orders, COALESCE(SUM(amount), 0) as revenue
            FROM orders
            WHERE created_at >= datetime('now', '-84 days')
            GROUP BY strftime('%Y-W%W', created_at)
            ORDER BY week ASC`,
    });

    // Monthly revenue for past 12 months
    const monthlyRevenue = await db.execute({
      sql: `SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as orders, COALESCE(SUM(amount), 0) as revenue
            FROM orders
            WHERE created_at >= datetime('now', '-12 months')
            GROUP BY strftime('%Y-%m', created_at)
            ORDER BY month ASC`,
    });

    // Recent orders (last 10)
    const recentOrders = await db.execute({
      sql: `SELECT id, customer_name, amount, status, created_at
            FROM orders
            ORDER BY created_at DESC
            LIMIT 10`,
    });

    // Low stock products
    const lowStock = await db.execute({
      sql: `SELECT id, name, stock, price
            FROM products
            WHERE stock > 0 AND stock <= 20
            ORDER BY stock ASC
            LIMIT 10`,
    });

    // Pending orders count
    const pendingOrders = await db.execute({
      sql: `SELECT COUNT(*) as count FROM orders WHERE status = 'pending'`,
    });

    const todayRow = todayStats.rows[0] as any;

    return Response.json({
      today: {
        orders: Number(todayRow?.orders_today ?? 0),
        revenue: Number(todayRow?.revenue_today ?? 0),
        new_customers: Number(todayRow?.new_customers_today ?? 0),
      },
      pending_orders: Number((pendingOrders.rows[0] as any)?.count ?? 0),
      daily: dailyRevenue.rows.map((r: any) => ({
        day: r.day,
        orders: Number(r.orders),
        revenue: Number(r.revenue),
      })),
      hourly: hourlyToday.rows.map((r: any) => ({
        hour: r.hour.padStart(2, '0'),
        orders: Number(r.orders),
        revenue: Number(r.revenue),
      })),
      weekly: weeklyRevenue.rows.map((r: any) => ({
        week: r.week,
        orders: Number(r.orders),
        revenue: Number(r.revenue),
      })),
      monthly: monthlyRevenue.rows.map((r: any) => ({
        month: r.month,
        orders: Number(r.orders),
        revenue: Number(r.revenue),
      })),
      recent_orders: recentOrders.rows.map((r: any) => ({
        id: r.id,
        customer_name: r.customer_name,
        amount: Number(r.amount),
        status: r.status,
        created_at: r.created_at,
      })),
      low_stock: lowStock.rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        stock: Number(r.stock),
        price: Number(r.price),
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error('[GET /api/analytics/realtime]', e);
    return Response.json({ error: 'Failed to fetch realtime analytics' }, { status: 500 });
  }
}
