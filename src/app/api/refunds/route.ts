import { db } from '@/lib/db';
import { type NextRequest } from 'next/server';
import { randomUUID } from 'crypto';

export async function GET() {
  try {
    const result = await db.execute(`SELECT * FROM refunds ORDER BY created_at DESC`);
    return Response.json({ refunds: result.rows });
  } catch (e) {
    console.error('[GET /api/refunds]', e);
    return Response.json({ error: 'Failed to fetch refunds' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { order_id, customer, amount, reason } = await request.json();
    if (!order_id || !customer || !amount) {
      return Response.json({ error: 'order_id, customer, and amount are required' }, { status: 400 });
    }
    const id = randomUUID().slice(0, 12);
    await db.execute({
      sql: `INSERT INTO refunds (id, order_id, customer, amount, reason) VALUES (?, ?, ?, ?, ?)`,
      args: [id, order_id, customer, Number(amount), reason || ''],
    });
    return Response.json({ id }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/refunds]', e);
    return Response.json({ error: 'Failed to create refund' }, { status: 500 });
  }
}
