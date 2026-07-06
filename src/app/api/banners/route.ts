import { db } from '@/lib/db';
import { type NextRequest } from 'next/server';
import { randomUUID } from 'crypto';

export async function GET() {
  try {
    const result = await db.execute(`SELECT * FROM banners ORDER BY sort_order ASC, created_at DESC`);
    return Response.json({ banners: result.rows });
  } catch (e) {
    console.error('[GET /api/banners]', e);
    return Response.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, subtitle, image_url, link, cta_text, active, sort_order } = await request.json();
    if (!title) return Response.json({ error: 'title is required' }, { status: 400 });
    const id = randomUUID().slice(0, 12);
    await db.execute({
      sql: `INSERT INTO banners (id, title, subtitle, image_url, link, cta_text, active, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, title, subtitle ?? null, image_url ?? '', link ?? '/', cta_text ?? 'Shop Now', active !== false ? 1 : 0, sort_order ?? 0],
    });
    return Response.json({ id }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/banners]', e);
    return Response.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}
