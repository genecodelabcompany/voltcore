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
      cat_id: row.cat_id,
      cat_name: row.cat_name || '',
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
      description: row.description,
      status: row.status,
      image_url: row.image_url,
      image_urls: row.image_urls ? JSON.parse(row.image_urls) : [],
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
    // Map frontend field names to DB column names
    const dbData: Record<string, unknown> = {};
    if (body.name !== undefined) dbData.name = body.name;
    if (body.cat_id !== undefined) dbData.cat_id = body.cat_id;
    if (body.price !== undefined) dbData.price = body.price;
    if (body.was !== undefined) dbData.was = body.was;
    if (body.sku !== undefined) dbData.sku = body.sku;
    if (body.brand !== undefined) dbData.brand = body.brand;
    if (body.badge !== undefined) dbData.badge = body.badge;
    if (body.description !== undefined) dbData.description = body.description;
    if (body.glyph !== undefined) dbData.glyph = body.glyph;
    if (body.image_url !== undefined) dbData.image_url = body.image_url;
    if (body.stock !== undefined) dbData.stock = body.stock;
    if (body.status !== undefined) dbData.status = body.status;
    if (body.image_urls !== undefined) dbData.image_urls = typeof body.image_urls === 'string' ? body.image_urls : JSON.stringify(body.image_urls);

    await updateProduct(id, dbData);
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
