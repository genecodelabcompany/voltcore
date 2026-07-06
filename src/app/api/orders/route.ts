import { type NextRequest } from 'next/server';
import { getOrders } from '@/lib/repos/orders';
import { createOrder } from '@/lib/repos/orders';

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const { rows, total } = await getOrders({
      status: sp.get('status') ?? undefined,
      search: sp.get('q') ?? undefined,
      limit: sp.get('limit') ? Number(sp.get('limit')) : 100,
      offset: sp.get('offset') ? Number(sp.get('offset')) : 0,
    });
    return Response.json({ orders: rows, total });
  } catch (e) {
    console.error('[GET /api/orders]', e);
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name, customer_email, customer_phone,
      address, city, amount, payment_ref, payment_method,
      shipping_method, notes, items,
    } = body;

    if (!customer_name || !customer_email || !amount || !items?.length) {
      return Response.json({ error: 'customer_name, customer_email, amount, items are required' }, { status: 400 });
    }

    const id = 'VC' + Date.now();
    await createOrder({
      id, customer_name, customer_email, customer_phone: customer_phone ?? '',
      address: address ?? '', city: city ?? '', amount,
      payment_ref, payment_method, shipping_method, notes, items,
    });

    return Response.json({ id }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/orders]', e);
    return Response.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
