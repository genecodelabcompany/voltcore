import { getOrderStats } from '@/lib/repos/orders';
import { getCourseStats } from '@/lib/repos/courses';
import { getServiceStats } from '@/lib/repos/services';
import { getTopProducts } from '@/lib/repos/products';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [orderStats, courseStats, serviceStats, productStats, topProducts, customerResult] = await Promise.all([
      getOrderStats(),
      getCourseStats(),
      getServiceStats(),
      db.execute(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
          SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) as out_of_stock,
          SUM(CASE WHEN stock > 0 AND stock <= 20 THEN 1 ELSE 0 END) as low_stock,
          COALESCE(SUM(stock), 0) as total_stock
        FROM products
      `),
      getTopProducts(5),
      db.execute(`SELECT COUNT(DISTINCT customer_email) as total FROM orders`),
    ]);

    const pr = productStats.rows[0] as unknown as Record<string, number>;
    const customerCount = Number((customerResult.rows[0] as unknown as Record<string, number>)?.total ?? 0);

    return Response.json({
      customer_count: customerCount,
      orders: orderStats,
      courses: {
        total: courseStats.total,
        published: courseStats.published,
        total_enrolled: courseStats.total_enrolled,
        total_revenue: courseStats.total_revenue,
        total_courses: courseStats.total,
        enrollments: courseStats.total_enrolled,
        free_courses: 0,
        paid_courses: courseStats.total,
        revenue: courseStats.total_revenue,
      },
      services: serviceStats,
      products: {
        total: pr.total ?? 0,
        published: pr.published ?? 0,
        out_of_stock: pr.out_of_stock ?? 0,
        low_stock: pr.low_stock ?? 0,
        total_stock: pr.total_stock ?? 0,
      },
      top_products: topProducts,
    });
  } catch (e) {
    console.error('[GET /api/analytics]', e);
    return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
