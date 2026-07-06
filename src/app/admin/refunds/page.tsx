'use client';
import { useState } from 'react';
import { PageHead } from '@/components/page-head';
import { MiniStat } from '@/components/mini-stat';
import { Icon } from '@/components/icon';
import { money } from '@/lib/utils';

type RefundStatus = 'requested' | 'approved' | 'processed' | 'rejected';
const tabs: { label: string; val: RefundStatus | 'all' }[] = [
  { label: 'All', val: 'all' },
  { label: 'Requested', val: 'requested' },
  { label: 'Approved', val: 'approved' },
  { label: 'Processed', val: 'processed' },
  { label: 'Rejected', val: 'rejected' },
];
const pillFor: Record<RefundStatus, string> = { requested: 'pill-amber', approved: 'pill-teal', processed: 'pill-green', rejected: 'pill-red' };

const refunds = [
  { id: 'RF-001', order: '#VC-1003', customer: 'Yaw Asante', amount: 320, reason: 'Arrived damaged — bent pins on component', status: 'requested' as RefundStatus, date: '2 Jun 2025' },
  { id: 'RF-002', order: '#VC-1007', customer: 'Kofi Annan', amount: 175, reason: 'Wrong item shipped', status: 'approved' as RefundStatus, date: '1 Jun 2025' },
  { id: 'RF-003', order: '#VC-0998', customer: 'Akosua Boateng', amount: 540, reason: 'Does not match product description', status: 'processed' as RefundStatus, date: '30 May 2025' },
  { id: 'RF-004', order: '#VC-1001', customer: 'Abena Ofori', amount: 210, reason: 'Customer changed mind', status: 'rejected' as RefundStatus, date: '29 May 2025' },
  { id: 'RF-005', order: '#VC-1012', customer: 'Nana Osei', amount: 89, reason: 'Item not received after 14 days', status: 'requested' as RefundStatus, date: '28 May 2025' },
];

export default function AdminRefunds() {
  const [tab, setTab] = useState<RefundStatus | 'all'>('all');
  const rows = tab === 'all' ? refunds : refunds.filter(r => r.status === tab);

  return (
    <div>
      <PageHead title="Refunds" sub="Process and track refund requests"
        actions={<button className="btn btn-ghost"><Icon name="download" size={16} />Export</button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <MiniStat label="Total Refunds" value={money(1334)} />
        <MiniStat label="Pending Review" value="2" c="var(--amber)" />
        <MiniStat label="Approved / Queued" value="1" c="var(--c-teal)" />
        <MiniStat label="Rejection Rate" value="20%" c="var(--c-red)" />
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
        <table className="tbl tbl-hover">
          <thead><tr><th>Refund ID</th><th>Order</th><th>Customer</th><th>Amount</th><th>Reason</th><th>Status</th><th>Date</th><th /></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{r.id}</td>
                <td className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{r.order}</td>
                <td style={{ fontWeight: 600 }}>{r.customer}</td>
                <td style={{ fontWeight: 700 }}>{money(r.amount)}</td>
                <td className="sub" style={{ fontSize: 13, maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.reason}</td>
                <td><span className={`pill ${pillFor[r.status]}`}>{r.status}</span></td>
                <td className="sub" style={{ fontSize: 13 }}>{r.date}</td>
                <td>
                  <div className="row gap6">
                    {r.status === 'requested' && <>
                      <button className="btn btn-soft btn-sm"><Icon name="check" size={14} />Approve</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }}>Reject</button>
                    </>}
                    {r.status === 'approved' && <button className="btn btn-soft btn-sm">Process</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
