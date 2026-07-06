import { type NextRequest } from 'next/server';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email, amount, metadata, callback_url } = await request.json();

    if (!email || !amount) {
      return Response.json({ error: 'email and amount are required' }, { status: 400 });
    }

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Paystack expects kobo/pesewa
        currency: 'GHS',
        callback_url: callback_url || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout?verify=1`,
        metadata: metadata || {},
      }),
    });

    const data = await res.json();

    if (!data.status) {
      return Response.json({ error: data.message || 'Paystack initialization failed' }, { status: 502 });
    }

    return Response.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
      access_code: data.data.access_code,
    });
  } catch (e) {
    console.error('[POST /api/paystack/initialize]', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
