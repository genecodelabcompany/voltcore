import { type NextRequest } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/repos/products';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) return Response.json({ error: 'Not found' }, { status: 404 });
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
