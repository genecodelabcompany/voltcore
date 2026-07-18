'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Pill } from '@/components/pill';
import { Icon } from '@/components/icon';
import { money } from '@/lib/utils';

interface OrderItem { id: string; product_id: string; name: string; price: number; qty: number; }
interface Order {
  id: string; customer_name: string; customer_email: string; customer_phone: string;
  address: string; city: string; region: string; amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_ref: string | null; payment_method: string; shipping_method: string;
  notes: string | null; created_at: string; items: OrderItem[];
}

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

export default function CustomerOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`)
      .then(r => r.json())
      .then(data => {
        setOrder(data.order);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const fmt = (dt: string) => {
    try {
      return new Date(dt).toLocaleString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch { return dt; }
  };

  if (loading) {
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Order Details</h2>
          <div className="sub" style={{ marginTop: 4 }}>Loading order information…</div>
        </div>
        <div className="card card-pad sub" style={{ textAlign: 'center', padding: '60px 0' }}>Loading order…</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Order Not Found</h2>
          <div className="sub" style={{ marginTop: 4 }}>This order could not be found.</div>
        </div>
        <div className="card card-pad" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Icon name="search" size={48} color="var(--line)" />
          <p className="sub" style={{ marginTop: 16, marginBottom: 24 }}>The order you're looking for doesn't exist or has been removed.</p>
          <Link href="/account/orders" className="btn btn-primary">Back to Orders</Link>
        </div>
      </div>
    );
  }

  const stepIdx = STATUS_STEPS.indexOf(order.status);
  const subtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = order.amount - subtotal;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div className="row between" style={{ alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Order #{order.id}</h2>
            <div className="sub" style={{ marginTop: 4 }}>{fmt(order.created_at)}</div>
          </div>
          <Link href="/account/orders" className="btn btn-ghost btn-sm">
            <Icon name="chevL" size={16} /> Back
          </Link>
        </div>
      </div>

      {/* Status timeline */}
      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, marginBottom: 20 }}>Order Status</div>
        <div className="row gap0" style={{ alignItems: 'flex-start' }}>
          {STATUS_STEPS.map((step, i) => {
            const done = i <= stepIdx && order.status !== 'cancelled';
            const active = i === stepIdx && order.status !== 'cancelled';
            return (
              <div key={step} className="row gap0" style={{ flex: 1, alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: done ? (active ? 'var(--blue-600)' : 'var(--c-green)') : 'var(--line)',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 13,
                  }}>
                    {done && !active ? <Icon name="check" size={14} /> : i + 1}
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: active ? 700 : 400,
                    color: active ? 'var(--blue-600)' : 'var(--muted)',
                    textTransform: 'capitalize', whiteSpace: 'nowrap',
                  }}>
                    {step}
                  </span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div style={{
                    flex: 1, height: 2,
                    background: i < stepIdx && order.status !== 'cancelled' ? 'var(--c-green)' : 'var(--line)',
                    marginTop: 16,
                  }} />
                )}
              </div>
            );
          })}
        </div>
        {order.status === 'cancelled' && (
          <div style={{ marginTop: 12, color: 'var(--c-red)', fontWeight: 600, fontSize: 13 }}>
            This order was cancelled.
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        {/* Order items */}
        <div>
          <div className="card card-pad" style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 16 }}>Order Items</div>
            <table className="tbl">
              <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th></tr></thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                    <td>{money(item.price)}</td>
                    <td>{item.qty}</td>
                    <td style={{ fontWeight: 700 }}>{money(item.price * item.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ borderTop: '1px solid var(--line)', marginTop: 16, paddingTop: 16 }}>
              <div className="row between" style={{ marginBottom: 8 }}>
                <span className="sub">Subtotal</span><span style={{ fontWeight: 600 }}>{money(subtotal)}</span>
              </div>
              <div className="row between" style={{ marginBottom: 8 }}>
                <span className="sub">Shipping ({order.shipping_method})</span>
                <span style={{ fontWeight: 600 }}>{shipping > 0 ? money(shipping) : 'Free'}</span>
              </div>
              <div className="row between" style={{ paddingTop: 10, borderTop: '1px solid var(--line)' }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--blue-600)' }}>{money(order.amount)}</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="card card-pad">
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Order Notes</div>
              <div className="sub" style={{ fontSize: 14, lineHeight: 1.6 }}>{order.notes}</div>
            </div>
          )}
        </div>

        {/* Customer + payment info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card card-pad">
            <div style={{ fontWeight: 700, marginBottom: 14 }}>Delivery Address</div>
            <div className="sub" style={{ fontSize: 14, lineHeight: 1.7 }}>
              {order.address}<br />{order.city}{order.region ? `, ${order.region}` : ''}
            </div>
          </div>

          <div className="card card-pad">
            <div style={{ fontWeight: 700, marginBottom: 14 }}>Payment</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <div className="row between">
                <span className="sub">Method</span>
                <span className="pill pill-teal" style={{ fontSize: 12 }}>{order.payment_method}</span>
              </div>
              <div className="row between">
                <span className="sub">Status</span>
                <Pill status={order.status} />
              </div>
              {order.payment_ref && (
                <div className="row between">
                  <span className="sub">Reference</span>
                  <span className="mono" style={{ fontSize: 12 }}>{order.payment_ref}</span>
                </div>
              )}
              <div className="row between" style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}>
                <span style={{ fontWeight: 700 }}>Amount Paid</span>
                <span style={{ fontWeight: 800, color: 'var(--c-green)' }}>{money(order.amount)}</span>
              </div>
            </div>
          </div>

          <div className="card card-pad" style={{ background: 'var(--blue-50)', borderColor: 'var(--blue-100)' }}>
            <div style={{ fontWeight: 700, color: 'var(--blue-700)', fontSize: 14, marginBottom: 6 }}>Need Help?</div>
            <div className="sub" style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>
              Having issues with this order? Our support team is here to help.
            </div>
            <Link href="/account/support" className="btn btn-ghost btn-block btn-sm">
              <Icon name="headset" size={16} /> Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
