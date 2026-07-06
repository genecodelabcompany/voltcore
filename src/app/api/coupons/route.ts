import { db } from '@/lib/db';
import { type NextRequest } from 'next/server';
import { randomUUID } from 'crypto';

export async function GET() {
  try {
    const result = await db.execute(`SELECT * FROM coupons ORDER BY created_at DESC`);
    return Response.json({ coupons: result.rows });
  } catch (e) {
    console.error('[GET /api/coupons]', e);
    return Response.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, discount_pct, max_uses, expires_at } = await request.json();
    if (!code || !discount_pct) return Response.json({ error: 'code and discount_pct are required' }, { status: 400 });
    const id = randomUUID().slice(0, 12);
    await db.execute({
      sql: `INSERT INTO coupons (id, code, discount_pct, max_uses, expires_at) VALUES (?, ?, ?, ?, ?)`,
      args: [id, code.toUpperCase(), Number(discount_pct), max_uses ?? 100, expires_at ?? null],
    });
    return Response.json({ id }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/coupons]', e);
    const msg = e instanceof Error && e.message.includes('UNIQUE') ? 'Coupon code already exists' : 'Failed to create coupon';
    return Response.json({ error: msg }, { status: 500 });
  }
}
