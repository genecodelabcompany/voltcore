'use client';
import { useState } from 'react';
import { Icon } from '@/components/icon';

const pillFor: Record<string, string> = { open: 'pill-amber', 'in-progress': 'pill-proc', resolved: 'pill-green' };

export default function SupportTickets() {
  const [showForm, setShowForm] = useState(false);

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
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>Subject</label>
            <input className="input" placeholder="Briefly describe your issue…" style={{ maxWidth: 480, display: 'block' }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>Category</label>
            <select className="input" style={{ maxWidth: 240 }}>
              <option>Order Issue</option>
              <option>Technical Support</option>
              <option>Refund Request</option>
              <option>Product Inquiry</option>
              <option>Other</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>Message</label>
            <textarea className="input" rows={5} placeholder="Describe your issue in detail…" style={{ maxWidth: 600, display: 'block', resize: 'vertical' }} />
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(false)}>Submit Ticket</button>
        </div>
      )}
      <div className="card card-pad" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
        <Icon name="help" size={40} color="var(--line)" />
        <div style={{ fontWeight: 700, marginTop: 16, marginBottom: 8 }}>No support tickets yet</div>
        <div className="sub" style={{ fontSize: 13 }}>Submit a ticket above and our team will get back to you.</div>
      </div>
    </div>
  );
}
