'use client';
import { useState, useEffect } from 'react';
import { PageHead } from '@/components/page-head';
import { MiniStat } from '@/components/mini-stat';
import { Icon } from '@/components/icon';
import { money } from '@/lib/utils';

interface Payment {
  id: string;
  order_id: string;
  customer_name: string;
  amount: number;
  method: string;
  status: string;
  reference: string;
  created_at: string;
}

const statuses = ['All', 'Paid', 'Pending', 'Failed', 'Refunded'];
const pillFor: Record<string, string> = { Paid: 'pill-green', Pending: 'pill-amber', Failed: 'pill-red', Refunded: 'pill-indigo' };
const dotFor: Record<string, string> = { Paid: 'var(--green)', Pending: 'var(--amber)', Failed: 'var(--red)', Refunded: 'var(--indigo)' };

export default function AdminPayments() {
  const [tab, setTab] = useState('All');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/payments')
      .then(r => r.json())
      .then(d => {
        setPayments(d.payments ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const rows = tab === 'All' ? payments : payments.filter(t => t.status.toLowerCase() === tab.toLowerCase());

  const totalRevenue = payments.reduce((s, p) => s + (p.status === 'Paid' ? p.amount : 0), 0);
  const pendingAmount = payments.reduce((s, p) => s + (p.status === 'Pending' ? p.amount : 0), 0);
  const failedCount = payments.filter(p => p.status === 'Failed').length;
  const refundedAmount = payments.reduce((s, p) => s + (p.status === 'Refunded' ? p.amount : 0), 0);

  const fmt = (dt: string) => {
    try { return new Date(dt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return dt; }
  };

  return (
    <div>
      <PageHead title="Payments" sub="Paystack & MTN MoMo transaction ledger"
        actions={<button className="btn btn-ghost"><Icon name="download" size={16} />Export CSV</button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <MiniStat label="Total Revenue" value={money(totalRevenue)} c="var(--c-green)" />
        <MiniStat label="Pending Clearance" value={money(pendingAmount)} c="var(--amber)" />
        <MiniStat label="Failed Transactions" value={String(failedCount)} c="var(--c-red)" />
        <MiniStat label="Refunded" value={money(refundedAmount)} c="var(--c-purple)" />
      </div>
      <div className="card card-pad">
        <div className="row gap8" style={{ marginBottom: 18 }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setTab(s)} className="btn btn-sm" style={{
              background: tab === s ? 'var(--blue-600)' : 'var(--surface-2)',
              color: tab === s ? '#fff' : 'var(--ink-2)',
              border: `1px solid ${tab === s ? 'var(--blue-600)' : 'var(--line)'}`,
            }}>{s}</button>
          ))}
        </div>
        {loading ? (
          <div className="sub" style={{ textAlign: 'center', padding: '48px 0' }}>Loading payments…</div>
        ) : (
          <table className="tbl tbl-hover">
            <thead><tr><th>Reference</th><th>Order</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {rows.map(t => (
                <tr key={t.id}>
                  <td className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{t.reference}</td>
                  <td className="mono" style={{ fontSize: 13, fontWeight: 600 }}>#{t.order_id}</td>
                  <td style={{ fontWeight: 600 }}>{t.customer_name}</td>
                  <td style={{ fontWeight: 700 }}>{money(t.amount)}</td>
                  <td>
                    <span className="pill pill-teal"><span className="dot" />{t.method}</span>
                  </td>
                  <td>
                    <span className={`pill ${pillFor[t.status] || 'pill-slate'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotFor[t.status] || 'var(--muted)', flexShrink: 0 }} />
                      {t.status}
                    </span>
                  </td>
                  <td className="sub" style={{ fontSize: 13 }}>{fmt(t.created_at)}</td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>No payments found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
