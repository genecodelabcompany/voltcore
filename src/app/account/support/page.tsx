'use client';
import { useState, useEffect } from 'react';
import { Icon } from '@/components/icon';
import { useUser } from '@clerk/nextjs';

interface Ticket {
  id: string; subject: string; category: string; status: string; created_at: string;
}

const statusStyles: Record<string, string> = {
  open: 'pill-amber', 'in-progress': 'pill-proc', resolved: 'pill-green',
};

export default function SupportTickets() {
  const { user } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Order Issue');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchTickets = () => {
    fetch('/api/support-tickets')
      .then(r => r.json())
      .then(d => { setTickets(d.tickets ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/support-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim(),
          category,
          message: message.trim(),
          customer_name: user?.fullName || user?.firstName || 'Customer',
          customer_email: user?.primaryEmailAddress?.emailAddress || '',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit');
      setSubject(''); setMessage(''); setCategory('Order Issue');
      setShowForm(false);
      fetchTickets();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (dt: string) => {
    try { return new Date(dt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return dt; }
  };

  return (
    <div>
      <div className="row between" style={{ marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Support Tickets</h2>
          <div className="sub" style={{ marginTop: 4 }}>Get help from the VoltCore engineering team</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(f => !f)}>
          <Icon name="plus" size={16} />{showForm ? 'Cancel' : 'New Ticket'}
        </button>
      </div>
      {showForm && (
        <div className="card card-pad" style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Submit a Support Request</div>
          {error && (
            <div style={{ marginBottom: 14, background: '#FEF2F2', color: 'var(--red)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
              {error}
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>Subject *</label>
            <input className="input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Briefly describe your issue…" style={{ maxWidth: 480, display: 'block' }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>Category</label>
            <select className="input" value={category} onChange={e => setCategory(e.target.value)} style={{ maxWidth: 240 }}>
              <option>Order Issue</option>
              <option>Technical Support</option>
              <option>Refund Request</option>
              <option>Product Inquiry</option>
              <option>Other</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>Message *</label>
            <textarea className="input" value={message} onChange={e => setMessage(e.target.value)} rows={5} placeholder="Describe your issue in detail…" style={{ maxWidth: 600, display: 'block', resize: 'vertical' }} />
          </div>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Ticket'}
          </button>
        </div>
      )}
      {loading ? (
        <div className="sub" style={{ textAlign: 'center', padding: '40px 0' }}>Loading tickets…</div>
      ) : tickets.length === 0 ? (
        <div className="card card-pad" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          <Icon name="help" size={40} color="var(--line)" />
          <div style={{ fontWeight: 700, marginTop: 16, marginBottom: 8 }}>No support tickets yet</div>
          <div className="sub" style={{ fontSize: 13 }}>Submit a ticket above and our team will get back to you.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tickets.map(t => (
            <div key={t.id} className="card card-pad row between" style={{ alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{t.subject}</div>
                <div className="sub" style={{ fontSize: 12, marginTop: 4 }}>{t.category} · {fmt(t.created_at)}</div>
              </div>
              <span className={`pill ${statusStyles[t.status] || 'pill-slate'}`} style={{ fontSize: 11, textTransform: 'capitalize' }}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
