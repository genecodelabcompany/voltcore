'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { MiniStat } from '@/components/mini-stat';
import { Pill } from '@/components/pill';
import { Icon } from '@/components/icon';
import { money } from '@/lib/utils';

interface Order {
  id: string; customer_name: string; customer_email: string;
  amount: number; status: string; created_at: string;
  item_count: number; payment_method: string;
}

const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [tab, setTab] = useState('All');
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ pending: 0, revenue: 0, avg_order: 0 });
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const status = tab === 'All' ? '' : tab.toLowerCase();
      const res = await fetch(`/api/orders${status ? `?status=${status}` : ''}`);
      const data = await res.json();
      setOrders(data.orders ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(d => {
      if (d.orders) setStats({ pending: d.orders.pending, revenue: d.orders.revenue, avg_order: d.orders.avg_order });
    });
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchOrders();
    });
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchOrders();
  };

  const fmt = (dt: string) => {
    try { return new Date(dt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return dt; }
  };

  return (
    <div>
      <PageHead title="Orders" sub="Manage and fulfill customer orders"
        actions={<>
          <button className="btn btn-ghost"><Icon name="download" size={16} />Export CSV</button>
        </>} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <MiniStat label="Total Orders" value={String(total)} />
        <MiniStat label="Pending Fulfillment" value={String(stats.pending)} c="var(--c-orange)" />
        <MiniStat label="Total Revenue" value={money(stats.revenue)} c="var(--c-green)" />
        <MiniStat label="Avg Order Value" value={money(stats.avg_order)} />
      </div>

      <div className="card card-pad">
        <div className="row gap8" style={{ marginBottom: 18, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} className="btn btn-sm" style={{
              background: tab === t ? 'var(--blue-600)' : 'var(--surface-2)',
              color: tab === t ? '#fff' : 'var(--ink-2)',
              border: `1px solid ${tab === t ? 'var(--blue-600)' : 'var(--line)'}`,
            }}>{t}</button>
          ))}
        </div>

        {loading ? (
          <div className="sub" style={{ textAlign: 'center', padding: '48px 0' }}>Loading orders…</div>
        ) : (
          <table className="tbl tbl-hover">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td className="mono" style={{ fontWeight: 600, fontSize: 13 }}>
                    <Link href={`/admin/orders/${o.id}`} className="link">#{o.id}</Link>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.customer_name}</div>
                    <div className="sub" style={{ fontSize: 12 }}>{o.customer_email}</div>
                  </td>
                  <td className="sub">{o.item_count} item{Number(o.item_count) !== 1 ? 's' : ''}</td>
                  <td style={{ fontWeight: 700 }}>{money(o.amount)}</td>
                  <td><span className="pill pill-teal"><span className="dot" />{o.payment_method}</span></td>
                  <td><Pill status={o.status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'} /></td>
                  <td className="sub" style={{ fontSize: 13 }}>{fmt(o.created_at)}</td>
                  <td>
                    <select
                      className="input"
                      style={{ fontSize: 12, padding: '4px 8px', height: 'auto' }}
                      value={o.status}
                      onChange={e => handleStatusChange(o.id, e.target.value)}
                    >
                      {['pending','processing','shipped','delivered','cancelled'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {!loading && orders.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>No orders found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
