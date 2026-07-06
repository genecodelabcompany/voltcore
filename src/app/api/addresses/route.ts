import { type NextRequest } from 'next/server';
import { db } from '@/lib/db';

function uid() {
  return 'addr_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export async function GET() {
  try {
    const result = await db.execute(
      'SELECT * FROM addresses ORDER BY is_default DESC, created_at ASC'
    );
    return Response.json({ addresses: result.rows });
  } catch (e) {
    console.error('[GET /api/addresses]', e);
    return Response.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { label, line1, line2, city, region, phone, is_default } = await request.json();
    if (!line1) return Response.json({ error: 'line1 is required' }, { status: 400 });

    const id = uid();
    await db.execute({
      sql: `INSERT INTO addresses (id, label, line1, line2, city, region, phone, is_default)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, label || 'Home', line1, line2 || '', city || '', region || '', phone || '', is_default ? 1 : 0],
    });

    return Response.json({ id }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/addresses]', e);
    return Response.json({ error: 'Failed to create address' }, { status: 500 });
  }
}
