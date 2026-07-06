import { type NextRequest } from 'next/server';
import { getServices, createService } from '@/lib/repos/services';
import { randomUUID } from 'crypto';

export async function GET() {
  try {
    const services = await getServices();
    return Response.json({ services });
  } catch (e) {
    console.error('[GET /api/services]', e);
    return Response.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title, from_price, eta, glyph, icon, description, sort_order } = body;
    if (!name || !title) {
      return Response.json({ error: 'name and title are required' }, { status: 400 });
    }
    const id = 's' + randomUUID().slice(0, 6);
    await createService({ id, name, title, from_price: from_price ?? 0, eta: eta ?? 'TBD', glyph: glyph ?? 'tool', icon: icon ?? '🔧', description: description ?? '', status: 'active', sort_order: sort_order ?? 0 });
    return Response.json({ id }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/services]', e);
    return Response.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
