import { db } from '@/lib/db';
import { type NextRequest } from 'next/server';
import { randomUUID } from 'crypto';

export async function GET() {
  try {
    const result = await db.execute(`SELECT * FROM reviews ORDER BY created_at DESC`);
    return Response.json({ reviews: result.rows });
  } catch (e) {
    console.error('[GET /api/reviews]', e);
    return Response.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { product_id, product_name, customer, rating, content } = await request.json();
    if (!product_id || !customer || !rating) {
      return Response.json({ error: 'product_id, customer, and rating are required' }, { status: 400 });
    }
    const id = randomUUID().slice(0, 12);
    await db.execute({
      sql: `INSERT INTO reviews (id, product_id, product_name, customer, rating, content) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [id, product_id, product_name || '', customer, Number(rating), content || ''],
    });
    return Response.json({ id }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/reviews]', e);
    return Response.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
