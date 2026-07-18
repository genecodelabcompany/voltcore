import { db } from '@/lib/db';
import { type NextRequest } from 'next/server';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const fields = Object.keys(body);
    if (!fields.length) return Response.json({ error: 'No fields' }, { status: 400 });
    const set = fields.map(f => `${f} = ?`).join(', ');
    await db.execute(`UPDATE reviews SET ${set} WHERE id = ?`, [...Object.values(body) as Array<string | number | boolean | null>, id]);
    return Response.json({ success: true });
  } catch (e) {
    console.error('[PATCH /api/reviews/[id]]', e);
    return Response.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.execute({ sql: 'DELETE FROM reviews WHERE id = ?', args: [id] });
    return Response.json({ success: true });
  } catch (e) {
    console.error('[DELETE /api/reviews/[id]]', e);
    return Response.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
