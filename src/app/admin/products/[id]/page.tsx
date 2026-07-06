'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';
import { VcSelect } from '@/components/vc-select';
import { money } from '@/lib/utils';

interface Category { id: string; name: string; }
interface Product {
  id: string; name: string; sku: string; brand: string; cat_id: string;
  price: number; was: number | null; stock: number; sold: number;
  description: string; glyph: string; image_url: string | null;
  status: string; badge: string | null; rating: number; reviews: number;
}

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${id}`).then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([prodData, catData]) => {
      setProduct(prodData.product);
      setCategories(catData.categories ?? []);
    });
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!product) return;
    setError(null);
    setSaving(true);
    try {
      let image_url = product.image_url;
      if (imageFile) {
        setUploading(true);
        const fd = new FormData();
        fd.append('file', imageFile);
        fd.append('folder', 'voltcore/products');
        const up = await fetch('/api/upload', { method: 'POST', body: fd });
        const upData = await up.json();
        setUploading(false);
        if (!up.ok) throw new Error(upData.error || 'Image upload failed');
        image_url = upData.url;
      }
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, image_url }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setProduct(prev => prev ? { ...prev, image_url } : prev);
      setImageFile(null);
      setImagePreview(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (!product) return (
    <div className="sub" style={{ textAlign: 'center', padding: '80px 0' }}>Loading product…</div>
  );

  const catLabels = categories.reduce((a, c) => { a[c.id] = c.name; return a; }, {} as Record<string, string>);
  const statusOptions = ['published', 'draft', 'hidden'];

  return (
    <div>
      <PageHead title={`Edit: ${product.name}`} sub={`SKU: ${product.sku} · ${money(product.price)}`}
        actions={
          <Link href="/admin/products" className="btn btn-ghost">
            <Icon name="chevL" size={16} /> Back to products
          </Link>
        } />

      <div className="card card-pad">
        {success && (
          <div style={{ marginBottom: 18, background: '#ECFDF3', color: 'var(--c-green)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="check" size={18} /> Product updated successfully.
          </div>
        )}
        {error && (
          <div style={{ marginBottom: 18, background: '#FEF2F2', color: 'var(--c-red)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="shield" size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'grid', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Product Name *</span>
              <input className="input" value={product.name} onChange={e => setProduct(p => p && { ...p, name: e.target.value })} required />
            </label>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>SKU *</span>
              <input className="input" value={product.sku} onChange={e => setProduct(p => p && { ...p, sku: e.target.value })} required />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 20 }}>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Category</span>
              <VcSelect value={catLabels[product.cat_id] || product.cat_id}
                options={categories.map(c => c.name)}
                onChange={v => { const f = categories.find(c => c.name === v); if (f) setProduct(p => p && { ...p, cat_id: f.id }); }} />
            </label>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Status</span>
              <VcSelect value={product.status} options={statusOptions}
                onChange={v => setProduct(p => p && { ...p, status: v })} />
            </label>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Price (GHS) *</span>
              <input className="input" type="number" step="0.01" min="0" value={product.price}
                onChange={e => setProduct(p => p && { ...p, price: parseFloat(e.target.value) })} required />
            </label>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Stock *</span>
              <input className="input" type="number" min="0" value={product.stock}
                onChange={e => setProduct(p => p && { ...p, stock: parseInt(e.target.value) })} required />
            </label>
          </div>

          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Brand</span>
            <input className="input" value={product.brand} onChange={e => setProduct(p => p && { ...p, brand: e.target.value })} />
          </label>

          {/* Image */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Product Image</div>
            {product.image_url && !imagePreview && (
              <img src={product.image_url} alt={product.name} style={{ maxHeight: 120, borderRadius: 8, marginBottom: 10, display: 'block' }} />
            )}
            <div style={{ border: '2px dashed var(--line)', borderRadius: 'var(--r)', padding: '16px', textAlign: 'center', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--blue-500)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; }}>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="img-edit" />
              <label htmlFor="img-edit" style={{ cursor: 'pointer', display: 'block' }}>
                {imagePreview ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <img src={imagePreview} alt="Preview" style={{ maxHeight: 120, borderRadius: 8 }} />
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>{uploading ? '⏳ Uploading…' : 'Click to change'}</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <Icon name="image" size={28} color="var(--muted)" />
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>{product.image_url ? 'Click to replace image' : 'Upload product image'}</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Description</span>
            <textarea className="input" style={{ minHeight: 100, resize: 'vertical' }}
              value={product.description} onChange={e => setProduct(p => p && { ...p, description: e.target.value })} />
          </label>

          <div className="row gap12" style={{ justifyContent: 'flex-end' }}>
            <Link href="/admin/products" className="btn btn-ghost">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (uploading ? <><Icon name="image" size={16} /> Uploading…</> : '⏳ Saving…') : <><Icon name="check" size={16} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
