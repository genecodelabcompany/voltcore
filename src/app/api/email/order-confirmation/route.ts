import { type NextRequest } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'VoltCore <noreply@voltcore.com.gh>';
const ADMIN_EMAIL = process.env.CONTACT_EMAIL || 'engineeringvoltcore@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const { order_id, customer_name, customer_email, items, amount, shipping_method } = await request.json();

    if (!customer_email || !order_id) {
      return Response.json({ error: 'customer_email and order_id are required' }, { status: 400 });
    }

    const itemsHtml = (items || [])
      .map((item: { name: string; qty: number; price: number }) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee">${item.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center">${item.qty}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;font-weight:700">GHS ${(item.price * item.qty).toFixed(2)}</td>
        </tr>`
      )
      .join('');

    const shippingLabel = shipping_method === 'express'
      ? 'Express Delivery (Same day, Accra) — GHS 75.00'
      : shipping_method === 'pickup'
      ? 'Pickup at Circle, Accra — Free'
      : 'Standard Delivery (2–3 days) — GHS 25.00';

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Order Confirmed — VoltCore</title></head>
      <body style="font-family:Inter,system-ui,sans-serif;background:#f8fafc;margin:0;padding:40px 0">
        <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06)">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#0f1f3d,#1a3560);padding:36px 40px;text-align:center">
            <div style="font-size:26px;font-weight:900;color:#fff;letter-spacing:-.5px">⚡ VoltCore</div>
            <div style="color:#93c5fd;font-size:13px;margin-top:6px">Ghana's Home for Electronics & Engineering</div>
          </div>
          <!-- Body -->
          <div style="padding:36px 40px">
            <div style="font-size:28px;margin-bottom:6px">🎉 Order Confirmed!</div>
            <p style="color:#64748b;font-size:15px;line-height:1.6">Hi <strong>${customer_name}</strong>, your order has been placed successfully.</p>
            <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px 20px;margin:20px 0">
              <div style="font-size:13px;color:#64748b">Order Number</div>
              <div style="font-size:20px;font-weight:800;color:#1d4ed8">#${order_id}</div>
            </div>
            <!-- Items table -->
            <table style="width:100%;border-collapse:collapse;margin:20px 0">
              <thead>
                <tr>
                  <th style="text-align:left;font-size:12px;color:#94a3b8;text-transform:uppercase;padding-bottom:8px;border-bottom:2px solid #e2e8f0">Item</th>
                  <th style="text-align:center;font-size:12px;color:#94a3b8;text-transform:uppercase;padding-bottom:8px;border-bottom:2px solid #e2e8f0">Qty</th>
                  <th style="text-align:right;font-size:12px;color:#94a3b8;text-transform:uppercase;padding-bottom:8px;border-bottom:2px solid #e2e8f0">Total</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <!-- Shipping & Total -->
            <div style="background:#f8fafc;border-radius:10px;padding:16px 20px">
              <div style="font-size:13px;color:#64748b;margin-bottom:6px">${shippingLabel}</div>
              <div style="font-size:18px;font-weight:800;color:#0f172a">Total: GHS ${Number(amount).toFixed(2)}</div>
            </div>
            <p style="color:#64748b;font-size:14px;line-height:1.6;margin-top:24px">
              We'll send you a shipping notification once your order is on its way. Orders are typically processed within 1 business day.
            </p>
            <a href="https://voltcore.com.gh/account/orders" style="display:inline-block;margin-top:20px;background:#1d4ed8;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:15px">Track My Order →</a>
          </div>
          <!-- Footer -->
          <div style="padding:24px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center">
            <div style="font-size:13px;color:#94a3b8">VoltCore Electronics · Electronics Hub, Circle, Accra, Ghana</div>
            <div style="font-size:13px;color:#94a3b8;margin-top:4px">📞 ${process.env.CONTACT_PHONE || '0559411222'} · ✉️ ${ADMIN_EMAIL}</div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to customer
    await resend.emails.send({
      from: FROM,
      to: [customer_email],
      subject: `✅ Order Confirmed — #${order_id} | VoltCore`,
      html,
    });

    // Notify admin
    await resend.emails.send({
      from: FROM,
      to: [ADMIN_EMAIL],
      subject: `New Order #${order_id} — ${customer_name} — GHS ${Number(amount).toFixed(2)}`,
      html: `<p>New order <strong>#${order_id}</strong> received from <strong>${customer_name}</strong> (${customer_email}) for <strong>GHS ${Number(amount).toFixed(2)}</strong>.</p><p>Shipping: ${shippingLabel}</p>`,
    });

    return Response.json({ sent: true });
  } catch (e) {
    console.error('[POST /api/email/order-confirmation]', e);
    return Response.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
