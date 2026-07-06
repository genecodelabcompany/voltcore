import { type NextRequest } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const status = sp.get('status') ?? undefined;
    const limit = sp.get('limit') ? Number(sp.get('limit')) : 100;
    const offset = sp.get('offset') ? Number(sp.get('offset')) : 0;

    let sql = `
      SELECT o.id, o.id as order_id, o.customer_name, o.amount, o.payment_method as method,
             o.status, o.payment_ref as reference, o.created_at
      FROM orders o
      WHERE o.payment_ref IS NOT NULL
    `;
    const args: any[] = [];

    if (status) {
      sql += ' AND LOWER(o.status) = LOWER(?)';
      args.push(status);
    }

    sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    args.push(limit, offset);

    const result = await db.execute({ sql, args });
    const payments = result.rows.map((r: any) => ({
      id: r.id,
      order_id: r.order_id,
      customer_name: r.customer_name,
      amount: r.amount,
      method: r.method || 'Paystack',
      status: r.status,
      reference: r.reference || r.id,
      created_at: r.created_at,
    }));

    return Response.json({ payments });
  } catch (e) {
    console.error('[GET /api/payments]', e);
    return Response.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
