'use client';
import { useState, useEffect } from 'react';
import { PageHead } from '@/components/page-head';
import { MiniStat } from '@/components/mini-stat';
import { Icon } from '@/components/icon';
import { money } from '@/lib/utils';

interface Service {
  id: string; name: string; title: string; from_price: number;
  eta: string; icon: string; description: string; status: string;
}
interface Inquiry {
  id: string; client: string; service_name: string; status: string;
  budget: string; description: string; date: string;
}

const reqPill: Record<string, string> = {
  pending: 'pill-amber', quoted: 'pill-teal', active: 'pill-proc',
  completed: 'pill-green', cancelled: 'pill-red', processing: 'pill-proc',
};

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_services: 0, open_inquiries: 0, active_projects: 0 });

  useEffect(() => {
    Promise.all([
      fetch('/api/services').then(r => r.json()),
      fetch('/api/service-inquiries').then(r => r.json()),
      fetch('/api/analytics').then(r => r.json()),
    ]).then(([svcData, inqData, analyticsData]) => {
      setServices(svcData.services ?? []);
      setInquiries(inqData.inquiries ?? []);
      if (analyticsData.services) setStats(analyticsData.services);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/service-inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    // Refresh
    const res = await fetch('/api/service-inquiries');
    const data = await res.json();
    setInquiries(data.inquiries ?? []);
  };

  const fmt = (dt: string) => {
    try { return new Date(dt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return dt; }
  };

  return (
    <div>
      <PageHead title="Engineering Services" sub="Configure offerings and manage service enquiries"
        actions={<button className="btn btn-primary"><Icon name="plus" size={16} />Add Service</button>} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <MiniStat label="Active Services" value={String(stats.total_services)} />
        <MiniStat label="Open Enquiries" value={String(stats.open_inquiries)} c="var(--amber)" />
        <MiniStat label="Active Projects" value={String(stats.active_projects)} c="var(--c-blue)" />
        <MiniStat label="Total Inquiries" value={String(inquiries.length)} c="var(--c-green)" />
      </div>

      {loading ? (
        <div className="card card-pad sub" style={{ textAlign: 'center', padding: '48px 0' }}>Loading…</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
            {services.map(s => (
              <div key={s.id} className="card card-pad">
                <div className="row between" style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <button className="btn btn-ghost btn-sm">Edit</button>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{s.title}</div>
                <div className="sub" style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>{s.description}</div>
                <div className="row between">
                  <span style={{ fontWeight: 700, fontSize: 14 }}>From {money(s.from_price)}</span>
                  <span className={`pill ${s.status === 'active' ? 'pill-green' : 'pill-slate'}`} style={{ fontSize: 11 }}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="card card-pad">
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Service Enquiries</div>
            <table className="tbl tbl-hover">
              <thead><tr><th>Client</th><th>Service</th><th>Description</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {inquiries.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.client}</td>
                    <td style={{ fontSize: 13 }}>{r.service_name}</td>
                    <td className="sub" style={{ fontSize: 13, maxWidth: 240, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.description}</td>
                    <td><span className={`pill ${reqPill[r.status] || 'pill-slate'}`}>{r.status}</span></td>
                    <td className="sub" style={{ fontSize: 13 }}>{fmt(r.date)}</td>
                    <td>
                      <div className="row gap6">
                        <select className="input" style={{ fontSize: 12, padding: '4px 8px', height: 'auto' }}
                          value={r.status} onChange={e => handleStatusChange(r.id, e.target.value)}>
                          {['pending','processing','quoted','active','completed','cancelled'].map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
                {inquiries.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>No inquiries yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
