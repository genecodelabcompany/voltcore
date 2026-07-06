import { type NextRequest } from 'next/server';
import { updateOrderStatus } from '@/lib/repos/orders';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { reference, order_id } = await request.json();

    if (!reference) {
      return Response.json({ error: 'reference is required' }, { status: 400 });
    }

    // Verify with Paystack
    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    });

    const data = await res.json();

    if (!data.status || data.data?.status !== 'success') {
      return Response.json({ error: 'Payment verification failed', details: data.message }, { status: 402 });
    }

    // Update order status if order_id provided
    if (order_id) {
      await updateOrderStatus(order_id, 'processing', reference);
    }

    return Response.json({
      verified: true,
      amount: data.data.amount / 100,
      reference: data.data.reference,
      channel: data.data.channel,
      paid_at: data.data.paid_at,
    });
  } catch (e) {
    console.error('[POST /api/paystack/verify]', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
