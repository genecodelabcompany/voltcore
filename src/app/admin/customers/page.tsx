'use client';
import { useState, useEffect, useCallback } from 'react';
import { PageHead } from '@/components/page-head';
import { MiniStat } from '@/components/mini-stat';
import { Icon } from '@/components/icon';
import { money } from '@/lib/utils';

interface Customer {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_count: number;
  total_spent: number;
  last_order_at: string;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    const res = await fetch(`/api/customers?${params}`);
    const data = await res.json();
    setCustomers(data.customers ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const fmt = (dt: string) => {
    try { return new Date(dt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return '—'; }
  };

  const initials = (name: string) =>
    name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');

  return (
    <div>
      <PageHead title="Customers" sub={`${total} customer${total !== 1 ? 's' : ''} from orders`}
        actions={
          <button className="btn btn-ghost"><Icon name="download" size={16} />Export</button>
        } />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <MiniStat label="Total Customers" value={String(total)} />
        <MiniStat label="Total Orders"    value={String(customers.reduce((s, c) => s + Number(c.order_count), 0))} />
        <MiniStat label="Total Revenue"   value={money(customers.reduce((s, c) => s + Number(c.total_spent), 0))} c="var(--c-green)" />
        <MiniStat label="Avg Order Value"
          value={money(customers.length ? customers.reduce((s, c) => s + Number(c.total_spent), 0) / customers.reduce((s, c) => s + Number(c.order_count), 0) || 0 : 0)} />
      </div>

      <div className="card card-pad">
        <div style={{ marginBottom: 16 }}>
          <div style={{ position: 'relative', maxWidth: 340 }}>
            <span style={{ position: 'absolute', left: 13, top: 11, color: 'var(--muted-2)' }}><Icon name="search" size={18} /></span>
            <input className="input" style={{ paddingLeft: 40 }} placeholder="Search by name or email…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="sub" style={{ textAlign: 'center', padding: '48px 0' }}>Loading customers…</div>
        ) : customers.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '48px 0', fontSize: 14 }}>
            No customers yet. Customers appear here once they place an order.
          </div>
        ) : (
          <table className="tbl tbl-hover">
            <thead>
              <tr>
                <th>Customer</th><th>Email</th><th>Phone</th>
                <th>Orders</th><th>Total Spent</th><th>Last Order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={i}>
                  <td>
                    <div className="row gap12">
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'var(--blue-100)', color: 'var(--blue-700)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 13, flexShrink: 0,
                      }}>
                        {initials(c.customer_name)}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 13.5 }}>{c.customer_name}</span>
                    </div>
                  </td>
                  <td className="sub" style={{ fontSize: 13 }}>{c.customer_email}</td>
                  <td className="sub" style={{ fontSize: 13 }}>{c.customer_phone || '—'}</td>
                  <td style={{ fontWeight: 600 }}>{c.order_count}</td>
                  <td style={{ fontWeight: 700 }}>{money(c.total_spent)}</td>
                  <td className="sub" style={{ fontSize: 13 }}>{fmt(c.last_order_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
