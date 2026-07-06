import { type NextRequest } from 'next/server';
import { getProducts } from '@/lib/repos/products';
import { createProduct } from '@/lib/repos/products';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const { rows, total } = await getProducts({
      cat_id: sp.get('cat') ?? undefined,
      status: sp.get('status') ?? undefined,
      search: sp.get('q') ?? undefined,
      limit: sp.get('limit') ? Number(sp.get('limit')) : 100,
      offset: sp.get('offset') ? Number(sp.get('offset')) : 0,
    });
    return Response.json({ products: rows, total });
  } catch (e) {
    console.error('[GET /api/products]', e);
    return Response.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name, cat_id, price, was, sku, brand, badge,
      description, glyph, image_url, stock, status,
    } = body;

    if (!name || !cat_id || !price || !sku) {
      return Response.json({ error: 'name, cat_id, price, sku are required' }, { status: 400 });
    }

    const id = randomUUID().slice(0, 12);
    await createProduct({ id, name, cat_id, price, was, sku, brand, badge, description, glyph, image_url, stock, status });
    return Response.json({ id }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/products]', e);
    return Response.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
