import { type NextRequest } from 'next/server';
import { getOrderById, updateOrderStatus } from '@/lib/repos/orders';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json({ order });
  } catch (e) {
    console.error('[GET /api/orders/[id]]', e);
    return Response.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, payment_ref } = await request.json();
    if (!status) return Response.json({ error: 'status is required' }, { status: 400 });
    await updateOrderStatus(id, status, payment_ref);
    return Response.json({ success: true });
  } catch (e) {
    console.error('[PATCH /api/orders/[id]]', e);
    return Response.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
