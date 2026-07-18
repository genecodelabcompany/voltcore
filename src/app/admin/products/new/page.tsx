'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';
import { VcSelect } from '@/components/vc-select';

interface Category { id: string; name: string; }

export default function AddProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('VoltCore');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Published');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => {
        const cats: Category[] = d.categories ?? [];
        setCategories(cats);
        if (cats.length > 0) setCategory(cats[0].id);
      });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles: File[] = [];
      const newPreviews: string[] = [];
      Array.from(files).forEach(file => {
        newFiles.push(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
      setImageFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      // 1. Upload all images
      const imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        setUploading(true);
        for (const file of imageFiles) {
          const fd = new FormData();
          fd.append('file', file);
          fd.append('folder', 'voltcore/products');
          const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd });
          const uploadData = await uploadRes.json();
          if (!uploadRes.ok) throw new Error(uploadData.error || 'Image upload failed');
          imageUrls.push(uploadData.url);
        }
        setUploading(false);
      }

      // 2. Create product
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, sku, brand,
          cat_id: category,
          price: parseFloat(price),
          stock: parseInt(stock),
          description,
          glyph: 'chip',
          image_url: imageUrls.length > 0 ? imageUrls[0] : null,
          image_urls: JSON.stringify(imageUrls),
          status: status.toLowerCase(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create product');

      setSuccess(data.id);
      // Reset form
      setName(''); setSku(''); setPrice(''); setStock(''); setDescription('');
      setImageFiles([]); setImagePreviews([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const statusOptions = ['Published', 'Draft', 'Hidden'];

  return (
    <div>
      <PageHead
        title="Add Product"
        sub="Create a new product listing for your store"
        actions={
          <Link href="/admin/products" className="btn btn-ghost">
            <Icon name="chevL" size={16} /> Back to products
          </Link>
        }
      />

      <div className="card card-pad">
        {success && (
          <div style={{ marginBottom: 18, background: '#ECFDF3', color: 'var(--c-green)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="check" size={18} />
            <div>
              Product created! ID: <strong>{success}</strong>.{' '}
              <Link href="/admin/products" className="link">View all products →</Link>
            </div>
          </div>
        )}
        {error && (
          <div style={{ marginBottom: 18, background: '#FEF2F2', color: 'var(--c-red)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="shield" size={18} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Product Name *</span>
              <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Enter product name" required />
            </label>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>SKU *</span>
              <input className="input" value={sku} onChange={e => setSku(e.target.value)} placeholder="e.g. VC-ARDUINO-001" required />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 20 }}>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Category *</span>
              <select className="input" value={category} onChange={e => setCategory(e.target.value)} required style={{ height: 36 }}>
                {categories.length === 0 && <option value="">No categories available</option>}
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Status</span>
              <VcSelect value={status} options={statusOptions} onChange={setStatus} />
            </label>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Price (GHS) *</span>
              <input className="input" type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" required />
            </label>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Stock *</span>
              <input className="input" type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} placeholder="0" required />
            </label>
          </div>

          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Brand</span>
            <input className="input" value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. Arduino" />
          </label>

          {/* Multiple Image Upload */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Product Images (you can upload multiple)</div>
            <div
              style={{ border: '2px dashed var(--line)', borderRadius: 'var(--r)', padding: '20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--blue-500)'; (e.currentTarget as HTMLElement).style.background = 'var(--blue-50)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} id="image-upload" />
              <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'block' }}>
                {imagePreviews.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                      {imagePreviews.map((preview, i) => (
                        <div key={i} style={{ position: 'relative' }}>
                          <img src={preview} alt={`Preview ${i + 1}`} style={{ maxHeight: 100, borderRadius: 8 }} />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            style={{
                              position: 'absolute', top: -6, right: -6, width: 22, height: 22,
                              borderRadius: '50%', border: 'none', background: 'var(--c-red)', color: '#fff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 12, cursor: 'pointer', lineHeight: 1,
                            }}
                          >×</button>
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                      {uploading ? '⏳ Uploading to ImageKit…' : 'Click to add more images'}
                    </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <Icon name="image" size={32} color="var(--muted)" />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>Upload product images</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>PNG, JPG up to 5MB each — uploads to ImageKit</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Description</span>
            <textarea className="input" style={{ minHeight: 120, resize: 'vertical' }}
              value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the product" />
          </label>

          <div className="row gap12" style={{ justifyContent: 'flex-end' }}>
            <Link href="/admin/products" className="btn btn-ghost">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (uploading ? <><Icon name="image" size={16} /> Uploading…</> : '⏳ Saving…') : <><Icon name="plus" size={16} /> Create Product</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
