'use client';
import { useState, useEffect, useCallback } from 'react';
import { PageHead } from '@/components/page-head';
import { MiniStat } from '@/components/mini-stat';
import { Icon } from '@/components/icon';
import { money } from '@/lib/utils';

type RefundStatus = 'requested' | 'approved' | 'processed' | 'rejected';
interface Refund {
  id: string; order_id: string; customer: string;
  amount: number; reason: string; status: RefundStatus;
  created_at: string;
}

const tabs: { label: string; val: RefundStatus | 'all' }[] = [
  { label: 'All', val: 'all' },
  { label: 'Requested', val: 'requested' },
  { label: 'Approved', val: 'approved' },
  { label: 'Processed', val: 'processed' },
  { label: 'Rejected', val: 'rejected' },
];
const pillFor: Record<RefundStatus, string> = { requested: 'pill-amber', approved: 'pill-teal', processed: 'pill-green', rejected: 'pill-red' };

export default function AdminRefunds() {
  const [tab, setTab] = useState<RefundStatus | 'all'>('all');
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/refunds').then(r => r.json());
      setRefunds(res.refunds ?? []);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/refunds/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const rows = tab === 'all' ? refunds : refunds.filter(r => r.status === tab);
  const totalAmount = refunds.reduce((s, r) => s + r.amount, 0);
  const pendingCount = refunds.filter(r => r.status === 'requested').length;
  const approvedCount = refunds.filter(r => r.status === 'approved').length;
  const rejectedCount = refunds.filter(r => r.status === 'rejected').length;
  const rejectionRate = refunds.length ? Math.round((rejectedCount / refunds.length) * 100) : 0;

  return (
    <div>
      <PageHead title="Refunds" sub="Process and track refund requests"
        actions={<button className="btn btn-ghost"><Icon name="download" size={16} />Export</button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <MiniStat label="Total Refunds" value={money(totalAmount)} />
        <MiniStat label="Pending Review" value={String(pendingCount)} c="var(--amber)" />
        <MiniStat label="Approved / Queued" value={String(approvedCount)} c="var(--c-teal)" />
        <MiniStat label="Rejection Rate" value={`${rejectionRate}%`} c="var(--c-red)" />
      </div>
      <div className="card card-pad">
        <div className="row gap8" style={{ marginBottom: 18 }}>
          {tabs.map(t => (
            <button key={t.val} onClick={() => setTab(t.val)} className="btn btn-sm" style={{
              background: tab === t.val ? 'var(--blue-600)' : 'var(--surface-2)',
              color: tab === t.val ? '#fff' : 'var(--ink-2)',
              border: `1px solid ${tab === t.val ? 'var(--blue-600)' : 'var(--line)'}`,
            }}>{t.label}</button>
          ))}
        </div>
        {loading ? (
          <div className="sub" style={{ padding: '32px 0', textAlign: 'center' }}>Loading refunds…</div>
        ) : rows.length === 0 ? (
          <div className="sub" style={{ padding: '32px 0', textAlign: 'center' }}>No refunds found.</div>
        ) : (
          <table className="tbl tbl-hover">
            <thead><tr><th>Refund ID</th><th>Order</th><th>Customer</th><th>Amount</th><th>Reason</th><th>Status</th><th>Date</th><th /></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{r.id}</td>
                  <td className="mono" style={{ fontSize: 13, fontWeight: 600 }}>#{r.order_id}</td>
                  <td style={{ fontWeight: 600 }}>{r.customer}</td>
                  <td style={{ fontWeight: 700 }}>{money(r.amount)}</td>
                  <td className="sub" style={{ fontSize: 13, maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.reason}</td>
                  <td><span className={`pill ${pillFor[r.status]}`}>{r.status}</span></td>
                  <td className="sub" style={{ fontSize: 13 }}>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="row gap6">
                      {r.status === 'requested' && <>
                        <button className="btn btn-soft btn-sm" onClick={() => updateStatus(r.id, 'approved')}>
                          <Icon name="check" size={14} />Approve
                        </button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }}
                          onClick={() => updateStatus(r.id, 'rejected')}>Reject</button>
                      </>}
                      {r.status === 'approved' && (
                        <button className="btn btn-soft btn-sm" onClick={() => updateStatus(r.id, 'processed')}>
                          Process
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
