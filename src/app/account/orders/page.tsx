'use client';
import { useState, useEffect } from 'react';
import { Pill } from '@/components/pill';
import { Icon } from '@/components/icon';
import { money } from '@/lib/utils';

interface Order {
  id: string; amount: number; status: string; created_at: string;
  item_count: number; customer_name: string;
}

const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered'];

export default function CustomerOrders() {
  const [tab, setTab] = useState('All');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const status = tab === 'All' ? '' : tab.toLowerCase();
    fetch(`/api/orders${status ? `?status=${status}` : ''}`)
      .then(r => r.json())
      .then(data => {
        setOrders(data.orders ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tab]);

  const fmt = (dt: string) => {
    try { return new Date(dt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return dt; }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>My Orders</h2>
        <div className="sub" style={{ marginTop: 4 }}>Track and manage your purchases</div>
      </div>
      <div className="orders-tab-bar row gap8" style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className="btn btn-sm" style={{
            background: tab === t ? 'var(--blue-600)' : 'var(--surface-2)',
            color: tab === t ? '#fff' : 'var(--ink-2)',
            border: `1px solid ${tab === t ? 'var(--blue-600)' : 'var(--line)'}`,
          }}>{t}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading ? (
          <div className="card card-pad sub" style={{ textAlign: 'center', padding: '40px 0' }}>Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="card card-pad" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
            No {tab.toLowerCase()} orders found.
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="card card-pad">
              <div className="row between" style={{ marginBottom: 14 }}>
                <div>
                  <span className="mono" style={{ fontWeight: 700, fontSize: 14 }}>#{order.id}</span>
                  <span className="sub" style={{ fontSize: 13, marginLeft: 12 }}>{fmt(order.created_at)}</span>
                </div>
                <Pill status={order.status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'} />
              </div>
              <div className="row gap16" style={{ alignItems: 'flex-start' }}>
                <div className="grow">
                  <div className="sub" style={{ fontSize: 13, marginTop: 3 }}>{order.item_count ?? 1} item{(order.item_count ?? 1) > 1 ? 's' : ''}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{money(order.amount)}</div>
                  <div className="row gap8" style={{ marginTop: 10 }}>
                    <button className="btn btn-ghost btn-sm">Details</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
