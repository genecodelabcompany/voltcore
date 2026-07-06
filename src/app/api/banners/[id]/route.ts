import { db } from '@/lib/db';
import { type NextRequest } from 'next/server';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const fields = Object.keys(body);
    if (!fields.length) return Response.json({ error: 'No fields to update' }, { status: 400 });
    const set = fields.map(f => `${f} = ?`).join(', ');
    await db.execute(`UPDATE banners SET ${set} WHERE id = ?`, [...Object.values(body) as Array<string | number | boolean | null>, id]);
    return Response.json({ success: true });
  } catch (e) {
    console.error('[PATCH /api/banners/[id]]', e);
    return Response.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.execute({ sql: 'DELETE FROM banners WHERE id = ?', args: [id] });
    return Response.json({ success: true });
  } catch (e) {
    console.error('[DELETE /api/banners/[id]]', e);
    return Response.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}
