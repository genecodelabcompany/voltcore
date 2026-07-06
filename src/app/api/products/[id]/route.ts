import { type NextRequest } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/repos/products';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const row = await getProductById(id);
    if (!row) return Response.json({ error: 'Not found' }, { status: 404 });
    const product = {
      id: row.id,
      name: row.name,
      cat: row.cat_id,
      category: row.cat_name || '',
      price: row.price,
      was: row.was,
      sku: row.sku,
      rating: row.rating,
      reviews: row.reviews,
      stock: row.stock,
      sold: row.sold,
      glyph: row.glyph,
      brand: row.brand,
      badge: row.badge,
      desc: row.description,
      image_url: row.image_url,
    };
    return Response.json({ product });
  } catch (e) {
    console.error('[GET /api/products/[id]]', e);
    return Response.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await updateProduct(id, body);
    return Response.json({ success: true });
  } catch (e) {
    console.error('[PUT /api/products/[id]]', e);
    return Response.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteProduct(id);
    return Response.json({ success: true });
  } catch (e) {
    console.error('[DELETE /api/products/[id]]', e);
    return Response.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
