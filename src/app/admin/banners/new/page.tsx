'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';

export default function AddBannerPage() {
  const router = useRouter();
  const [title, setTitle]       = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [link, setLink]         = useState('/shop');
  const [ctaText, setCtaText]   = useState('Shop Now');
  const [sortOrder, setSortOrder] = useState('0');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl]  = useState('');
  const [preview, setPreview]    = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]      = useState(false);
  const [error, setError]        = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      let finalUrl = imageUrl;
      if (imageFile) {
        setUploading(true);
        const fd = new FormData();
        fd.append('file', imageFile);
        fd.append('folder', 'voltcore/banners');
        const upRes = await fetch('/api/upload', { method: 'POST', body: fd });
        const upData = await upRes.json();
        setUploading(false);
        if (!upRes.ok) throw new Error(upData.error || 'Image upload failed');
        finalUrl = upData.url;
      }

      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, subtitle, link, cta_text: ctaText,
          image_url: finalUrl, sort_order: parseInt(sortOrder),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create banner');
      router.push('/admin/banners');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div>
      <PageHead title="New Banner" sub="Add a homepage or hero banner"
        actions={<Link href="/admin/banners" className="btn btn-ghost"><Icon name="chevL" size={16} /> Back</Link>} />

      <div className="card card-pad" style={{ maxWidth: 640 }}>
        {error && (
          <div style={{ marginBottom: 18, background: '#FEF2F2', color: 'var(--c-red)', borderRadius: 10, padding: '14px 18px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <Icon name="shield" size={18} /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>

          <div>
            <div style={{ fontWeight: 600, marginBottom: 10 }}>Banner Image</div>
            <label style={{ cursor: 'pointer', display: 'block' }}>
              <div style={{
                border: '2px dashed var(--line)', borderRadius: 12, overflow: 'hidden',
                height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--surface-2)', position: 'relative',
              }}>
                {preview ? (
                  <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
                    <Icon name="image" size={32} color="var(--line)" />
                    <div style={{ marginTop: 8, fontSize: 13 }}>Click to upload banner image</div>
                    <div style={{ fontSize: 11, marginTop: 4 }}>Recommended: 1200 × 400 px</div>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageSelect} />
            </label>
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Or paste an image URL</div>
              <input className="input" value={imageUrl}
                onChange={e => { setImageUrl(e.target.value); if (!imageFile) setPreview(e.target.value); }}
                placeholder="https://res.cloudinary.com/…" />
            </div>
          </div>

          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Title *</span>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. New Arrivals" />
          </label>

          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Subtitle</span>
            <input className="input" value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Short tagline (optional)" />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Link URL</span>
              <input className="input" value={link} onChange={e => setLink(e.target.value)} placeholder="/shop" />
            </label>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>CTA Button Text</span>
              <input className="input" value={ctaText} onChange={e => setCtaText(e.target.value)} placeholder="Shop Now" />
            </label>
          </div>

          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Sort Order</span>
            <input className="input" type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={{ maxWidth: 120 }} />
          </label>

          <div className="row gap12" style={{ justifyContent: 'flex-end' }}>
            <Link href="/admin/banners" className="btn btn-ghost">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
              {uploading ? '⏳ Uploading image…' : saving ? '⏳ Saving…' : <><Icon name="plus" size={16} /> Create Banner</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
