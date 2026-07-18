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
  image_urls: string[];
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${id}`).then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([prodData, catData]) => {
      const p = prodData.product;
      setProduct(p);
      setExistingImages(p.image_urls || (p.image_url ? [p.image_url] : []));
      setCategories(catData.categories ?? []);
    });
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        setImageFiles(prev => [...prev, file]);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!product) return;
    setError(null);
    setSaving(true);
    try {
      // Upload new images
      const newUrls: string[] = [];
      if (imageFiles.length > 0) {
        setUploading(true);
        for (const file of imageFiles) {
          const fd = new FormData();
          fd.append('file', file);
          fd.append('folder', 'voltcore/products');
          const up = await fetch('/api/upload', { method: 'POST', body: fd });
          const upData = await up.json();
          if (!up.ok) throw new Error(upData.error || 'Image upload failed');
          newUrls.push(upData.url);
        }
        setUploading(false);
      }

      // Combine existing (kept) + new images
      const allImageUrls = [...existingImages, ...newUrls];

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          image_url: allImageUrls.length > 0 ? allImageUrls[0] : null,
          image_urls: JSON.stringify(allImageUrls),
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setProduct(prev => prev ? { ...prev, image_url: allImageUrls.length > 0 ? allImageUrls[0] : null, image_urls: allImageUrls } : prev);
      setImageFiles([]);
      setImagePreviews([]);
      setExistingImages(allImageUrls);
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

          {/* Multiple Image Upload */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Product Images</div>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {existingImages.map((url, i) => (
                  <div key={`existing-${i}`} style={{ position: 'relative' }}>
                    <img src={url} alt={`Image ${i + 1}`} style={{ maxHeight: 100, borderRadius: 8, border: '1px solid var(--line)' }} />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
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
            )}

            {/* New image previews */}
            {imagePreviews.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {imagePreviews.map((preview, i) => (
                  <div key={`new-${i}`} style={{ position: 'relative' }}>
                    <img src={preview} alt={`New ${i + 1}`} style={{ maxHeight: 100, borderRadius: 8, border: '1px solid var(--blue-500)' }} />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
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
            )}

            <div style={{ border: '2px dashed var(--line)', borderRadius: 'var(--r)', padding: '16px', textAlign: 'center', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--blue-500)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; }}>
              <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} id="img-edit" />
              <label htmlFor="img-edit" style={{ cursor: 'pointer', display: 'block' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <Icon name="image" size={28} color="var(--muted)" />
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>Click to add more images</span>
                </div>
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
