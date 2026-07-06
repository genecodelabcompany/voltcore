'use client';
import { useState } from 'react';
import { PageHead } from '@/components/page-head';
import { MiniStat } from '@/components/mini-stat';
import { Icon } from '@/components/icon';
import { money } from '@/lib/utils';

const statuses = ['All', 'Paid', 'Pending', 'Failed', 'Refunded'];
const pillFor: Record<string, string> = { Paid: 'pill-green', Pending: 'pill-amber', Failed: 'pill-red', Refunded: 'pill-indigo' };
const dotFor: Record<string, string> = { Paid: 'var(--green)', Pending: 'var(--amber)', Failed: 'var(--red)', Refunded: 'var(--indigo)' };

const txns = [
  { ref: 'TXN-1000', order: '#VC-1001', customer: 'Kwame Mensah', amount: 'GHS 450.00', method: 'MTN MoMo', status: 'Paid' as const, date: '3 Jun 2025' },
  { ref: 'TXN-1001', order: '#VC-1002', customer: 'Akosua Boateng', amount: 'GHS 1,280.00', method: 'Paystack', status: 'Paid' as const, date: '2 Jun 2025' },
  { ref: 'TXN-1002', order: '#VC-1003', customer: 'Yaw Asante', amount: 'GHS 320.00', method: 'Paystack', status: 'Paid' as const, date: '2 Jun 2025' },
  { ref: 'TXN-1003', order: '#VC-1004', customer: 'Esi Nyarko', amount: 'GHS 890.00', method: 'MTN MoMo', status: 'Pending' as const, date: '1 Jun 2025' },
  { ref: 'TXN-1004', order: '#VC-1005', customer: 'Nana Osei', amount: 'GHS 2,150.00', method: 'Paystack', status: 'Failed' as const, date: '1 Jun 2025' },
  { ref: 'TXN-1005', order: '#VC-1006', customer: 'Adwoa Sarpong', amount: 'GHS 675.00', method: 'MTN MoMo', status: 'Refunded' as const, date: '31 May 2025' },
  { ref: 'TXN-1006', order: '#VC-1007', customer: 'Kofi Annan', amount: 'GHS 175.00', method: 'Paystack', status: 'Paid' as const, date: '30 May 2025' },
  { ref: 'TXN-1007', order: '#VC-1008', customer: 'Ama Serwaa', amount: 'GHS 3,400.00', method: 'MTN MoMo', status: 'Paid' as const, date: '29 May 2025' },
  { ref: 'TXN-1008', order: '#VC-1009', customer: 'Kojo Addae', amount: 'GHS 540.00', method: 'Paystack', status: 'Pending' as const, date: '28 May 2025' },
  { ref: 'TXN-1009', order: '#VC-1010', customer: 'Abena Ofori', amount: 'GHS 210.00', method: 'MTN MoMo', status: 'Failed' as const, date: '27 May 2025' },
];

export default function AdminPayments() {
  const [tab, setTab] = useState('All');
  const rows = tab === 'All' ? txns : txns.filter(t => t.status === tab);

  return (
    <div>
      <PageHead title="Payments" sub="Paystack & MTN MoMo transaction ledger"
        actions={<button className="btn btn-ghost"><Icon name="download" size={16} />Export CSV</button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <MiniStat label="Total Revenue" value="GHS 214,560" c="var(--c-green)" />
        <MiniStat label="Pending Clearance" value="GHS 8,420" c="var(--amber)" />
        <MiniStat label="Failed Transactions" value="12" c="var(--c-red)" />
        <MiniStat label="Refunded" value="GHS 3,840" c="var(--c-purple)" />
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
        <table className="tbl tbl-hover">
          <thead><tr><th>Reference</th><th>Order</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {rows.map((t, i) => (
              <tr key={i}>
                <td className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{t.ref}</td>
                <td className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{t.order}</td>
                <td style={{ fontWeight: 600 }}>{t.customer}</td>
                <td style={{ fontWeight: 700 }}>{t.amount}</td>
                <td>
                  <span className="pill pill-teal"><span className="dot" />{t.method}</span>
                </td>
                <td>
                  <span className={`pill ${pillFor[t.status]}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotFor[t.status], flexShrink: 0 }} />
                    {t.status}
                  </span>
                </td>
                <td className="sub" style={{ fontSize: 13 }}>{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
