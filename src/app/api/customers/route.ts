import { db } from '@/lib/db';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const search = sp.get('q') ?? '';
    const limit = Number(sp.get('limit') ?? 100);
    const offset = Number(sp.get('offset') ?? 0);

    const searchClause = search
      ? `WHERE customer_name LIKE ? OR customer_email LIKE ?`
      : '';
    const args = search ? [`%${search}%`, `%${search}%`] : [];

    const countResult = await db.execute({
      sql: `SELECT COUNT(DISTINCT customer_email) as total FROM orders ${searchClause}`,
      args,
    });
    const total = Number((countResult.rows[0] as Record<string, unknown>)?.total ?? 0);

    const rows = await db.execute({
      sql: `SELECT
              customer_name,
              customer_email,
              customer_phone,
              COUNT(*) as order_count,
              COALESCE(SUM(amount), 0) as total_spent,
              MAX(created_at) as last_order_at
            FROM orders
            ${searchClause}
            GROUP BY customer_email
            ORDER BY total_spent DESC
            LIMIT ? OFFSET ?`,
      args: [...args, limit, offset],
    });

    return Response.json({ customers: rows.rows, total });
  } catch (e) {
    console.error('[GET /api/customers]', e);
    return Response.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
