'use client';
import { useState, useEffect } from 'react';
import { StoreShell } from '@/components/shells/store-shell';
import { Icon } from '@/components/icon';
import { money } from '@/lib/utils';

interface Service {
  id: string; name: string; title: string; from_price: number;
  eta: string; icon: string; description: string; status: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('Under GHS 1,000');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(data => {
        setServices(data.services ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setName(''); setCompany(''); setEmail(''); setPhone('');
    setDescription(''); setBudget('Under GHS 1,000'); setFile(null);
  };

  const handleSubmit = async () => {
    if (!name || !email || !description) {
      setError('Please fill in your name, email, and project description.');
      return;
    }
    setSending(true);
    setError(null);

    try {
      // Upload file if provided
      let file_url: string | null = null;
      if (file) {
        setUploading(true);
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', 'voltcore/inquiries');
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd });
        const uploadData = await uploadRes.json();
        setUploading(false);
        if (!uploadRes.ok) throw new Error(uploadData.error || 'File upload failed');
        file_url = uploadData.url;
      }

      const service = services.find(s => s.id === selected);
      const res = await fetch('/api/service-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: name,
          client_email: email,
          client_phone: phone,
          service_id: selected,
          service_name: service?.title || service?.name || '',
          budget,
          description: description + (file_url ? `\n\nAttached file: ${file_url}` : ''),
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to submit enquiry');
      }

      setSubmitted(true);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSending(false);
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <StoreShell>
        <div style={{ maxWidth: 600, margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
          <div className="card card-pad">
            <div style={{
              width: 80, height: 80, borderRadius: '50%', background: 'var(--green-bg)', color: 'var(--green)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            }}>
              <Icon name="check" size={36} color="var(--green)" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Enquiry Sent!</h2>
            <p className="sub" style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
              Our engineering team will review your requirements and respond within 24 hours.
            </p>
            <button className="btn btn-primary" onClick={() => { setSubmitted(false); setSelected(null); }}>
              Submit Another Enquiry
            </button>
          </div>
        </div>
      </StoreShell>
    );
  }

  if (selected) {
    const service = services.find(s => s.id === selected);
    if (!service) return null;
    return (
      <StoreShell>
        <div style={{ maxWidth: 680, margin: '40px auto', padding: '0 24px' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)} style={{ marginBottom: 20 }}>
            <Icon name="arrow-left" size={14} />Back to Services
          </button>
          <div className="card card-pad">
            <div style={{ fontSize: 40, marginBottom: 12 }}>{service.icon}</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>{service.title}</h2>
            <div className="sub" style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>{service.description}</div>
            <div style={{ height: 1, background: 'var(--line)', marginBottom: 24 }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Request a Quote</h3>

            {error && (
              <div style={{ marginBottom: 16, background: '#FEF2F2', color: 'var(--c-red)', borderRadius: 10, padding: '12px 16px', fontSize: 14 }}>
                <Icon name="shield" size={14} /> {error}
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Your Name *</label>
              <input className="input" type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', maxWidth: '100%' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Company (optional)</label>
              <input className="input" type="text" value={company} onChange={e => setCompany(e.target.value)} style={{ width: '100%', maxWidth: '100%' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email Address *</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', maxWidth: '100%' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Phone Number</label>
              <input className="input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', maxWidth: '100%' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Project Description *</label>
              <textarea className="input" rows={5} value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Describe your project requirements, timeline, and budget…"
                style={{ width: '100%', maxWidth: '100%', resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Budget Range</label>
              <select className="input" value={budget} onChange={e => setBudget(e.target.value)} style={{ maxWidth: 260 }}>
                <option>Under GHS 1,000</option>
                <option>GHS 1,000 – 5,000</option>
                <option>GHS 5,000 – 20,000</option>
                <option>Over GHS 20,000</option>
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Attach Files (schematics, photos, documents)</label>
              <div style={{
                border: '2px dashed var(--line)', borderRadius: 'var(--r)', padding: '16px', textAlign: 'center', cursor: 'pointer',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--blue-500)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; }}>
                <input type="file" accept="image/*,.pdf,.doc,.docx,.zip,.dxf,.sch,.brd" onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) setFile(f);
                }} style={{ display: 'none' }} id="inq-file" />
                <label htmlFor="inq-file" style={{ cursor: 'pointer', display: 'block' }}>
                  {file ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                      <Icon name="check" size={16} color="var(--c-green)" />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{file.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>({(file.size / 1024).toFixed(0)} KB)</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <Icon name="upload" size={24} color="var(--muted)" />
                      <span style={{ fontSize: 13, color: 'var(--muted)' }}>Click to upload files (images, PDFs, CAD files)</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSubmit} disabled={sending}>
              {sending ? (uploading ? '⏳ Uploading file…' : '⏳ Sending…') : 'Send Enquiry'}
            </button>
          </div>
        </div>
      </StoreShell>
    );
  }

  return (
    <StoreShell>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy), #1e3a5f)',
        padding: '60px 40px', color: '#fff', textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: .6, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
          Engineering Services
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 14px', lineHeight: 1.2 }}>
          Professional Electronics<br />Engineering Solutions
        </h1>
        <p style={{ fontSize: 16, opacity: .8, maxWidth: 520, margin: '0 auto' }}>
          From PCB design to embedded firmware, our expert team delivers end-to-end engineering services for startups, SMEs, and enterprises across Ghana.
        </p>
      </div>

      {/* Services grid */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        {loading ? (
          <div className="sub" style={{ textAlign: 'center', padding: '48px 0' }}>Loading services…</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24, marginBottom: 48 }}>
            {services.map(s => (
              <div key={s.id} className="card card-pad" style={{ cursor: 'pointer' }} onClick={() => setSelected(s.id)}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{s.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 8px' }}>{s.title}</h3>
                <div className="sub" style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{s.description}</div>
                <div className="row between" style={{ alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: 'var(--blue-600)', fontSize: 15 }}>From {money(s.from_price)}</span>
                  <button className="btn btn-soft btn-sm" onClick={e => { e.stopPropagation(); setSelected(s.id); }}>
                    Get Quote <Icon name="arrow-right" size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div style={{
          background: 'linear-gradient(135deg, var(--navy), #1a3560)',
          borderRadius: 'var(--r-lg)', padding: '48px 40px', color: '#fff', textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 12px' }}>Not sure what you need?</h2>
          <p style={{ opacity: .8, fontSize: 15, margin: '0 0 24px' }}>
            Talk to one of our engineers. We'll help scope your project and recommend the best approach.
          </p>
          <div className="row gap12" style={{ justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => services.length > 0 && setSelected(services[0].id)}>Start a Project</button>
            <button className="btn btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.3)' }}>
              <Icon name="phone" size={16} />Call Us
            </button>
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
