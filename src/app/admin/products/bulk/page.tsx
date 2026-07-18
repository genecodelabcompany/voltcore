'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';

interface Category { id: string; name: string; }

interface BulkResult {
  index: number;
  id: string;
  name: string;
  sku: string;
  success: boolean;
  error?: string;
}

export default function BulkUploadPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mode, setMode] = useState<'csv' | 'json'>('csv');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<BulkResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => setCategories(d.categories ?? []));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCsvFile(file);
    setResults(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResults(null);
    setUploading(true);

    try {
      let res: Response;

      if (mode === 'csv') {
        if (!csvFile) throw new Error('Please select a CSV file');
        const fd = new FormData();
        fd.append('file', csvFile);
        res = await fetch('/api/products/bulk', { method: 'POST', body: fd });
      } else {
        let products: any[];
        try {
          products = JSON.parse(jsonText);
          if (!Array.isArray(products)) products = [products];
        } catch {
          throw new Error('Invalid JSON. Must be an array of product objects.');
        }
        res = await fetch('/api/products/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products }),
        });
      }

      const data = await res.json();
      if (data.results) {
        setResults(data.results);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  const successCount = results ? results.filter(r => r.success).length : 0;
  const failCount = results ? results.filter(r => !r.success).length : 0;

  const downloadSampleCSV = () => {
    const headers = ['name', 'sku', 'cat_id', 'price', 'stock', 'brand', 'description', 'status', 'glyph', 'image_url', 'was', 'badge'];
    const sample = [
      headers.join(','),
      '"Arduino Uno R3","VC-ARDUINO-001","cat_001",29.99,50,"Arduino","The classic Arduino Uno board","published","chip","https://example.com/uno.jpg",,',
      '"Raspberry Pi 5","VC-RPI-005","cat_001",79.99,30,"Raspberry Pi","Latest Raspberry Pi 5","published","chip","",,',
      '"Jumper Wire Kit","VC-JUMPER-001","cat_002",4.99,200,"VoltCore","Assorted jumper wires","published","chip","",,',
    ].join('\n');

    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-products.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHead
        title="Bulk Upload Products"
        sub="Upload multiple products at once via CSV or JSON"
        actions={
          <Link href="/admin/products" className="btn btn-ghost">
            <Icon name="chevL" size={16} /> Back to products
          </Link>
        }
      />

      <div className="card card-pad" style={{ marginBottom: 20 }}>
        {/* Mode Toggle */}
        <div className="row gap12" style={{ marginBottom: 24 }}>
          <button
            className={`btn ${mode === 'csv' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => { setMode('csv'); setResults(null); setError(null); }}
          >
            <Icon name="file" size={16} /> CSV Upload
          </button>
          <button
            className={`btn ${mode === 'json' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => { setMode('json'); setResults(null); setError(null); }}
          >
            <Icon name="code" size={16} /> JSON Paste
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'csv' ? (
            <div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Upload CSV File</div>
                <div
                  style={{
                    border: '2px dashed var(--line)',
                    borderRadius: 'var(--r)',
                    padding: '32px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: csvFile ? 'var(--blue-50)' : 'transparent',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--blue-500)'; (e.currentTarget as HTMLElement).style.background = 'var(--blue-50)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; if (!csvFile) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  {csvFile ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <Icon name="check" size={32} color="var(--c-green)" />
                      <span style={{ fontWeight: 600 }}>{csvFile.name}</span>
                      <span className="sub" style={{ fontSize: 12 }}>
                        {(csvFile.size / 1024).toFixed(1)} KB — Click to change
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <Icon name="upload" size={32} color="var(--muted)" />
                      <span style={{ fontWeight: 600, fontSize: 14 }}>Drop CSV file here or click to browse</span>
                      <span className="sub" style={{ fontSize: 12 }}>
                        CSV with headers: name, sku, cat_id, price, stock, brand, description, status
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="row gap12" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <button type="button" className="btn btn-ghost" onClick={downloadSampleCSV}>
                  <Icon name="download" size={16} /> Download Sample CSV
                </button>
                <div className="row gap12">
                  <Link href="/admin/products" className="btn btn-ghost">Cancel</Link>
                  <button type="submit" className="btn btn-primary" disabled={uploading || !csvFile}>
                    {uploading ? '⏳ Uploading…' : <><Icon name="upload" size={16} /> Upload Products</>}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Paste JSON Array</div>
              <textarea
                className="input"
                style={{ minHeight: 250, resize: 'vertical', fontFamily: 'monospace', fontSize: 13 }}
                value={jsonText}
                onChange={e => { setJsonText(e.target.value); setResults(null); setError(null); }}
                placeholder={`[\n  {\n    "name": "Arduino Uno R3",\n    "sku": "VC-ARDUINO-001",\n    "cat_id": "cat_001",\n    "price": 29.99,\n    "stock": 50,\n    "brand": "Arduino",\n    "description": "The classic Arduino Uno board",\n    "status": "published"\n  }\n]`}
              />
              <div className="row gap12" style={{ justifyContent: 'flex-end', marginTop: 16 }}>
                <Link href="/admin/products" className="btn btn-ghost">Cancel</Link>
                <button type="submit" className="btn btn-primary" disabled={uploading || !jsonText.trim()}>
                  {uploading ? '⏳ Uploading…' : <><Icon name="upload" size={16} /> Upload Products</>}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginBottom: 18, background: '#FEF2F2', color: 'var(--c-red)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="shield" size={18} />
          <div>{error}</div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="card card-pad">
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>
              {successCount > 0 && <span style={{ color: 'var(--c-green)' }}>✓ {successCount} created</span>}
              {failCount > 0 && <span style={{ color: 'var(--c-red)', marginLeft: 12 }}>✗ {failCount} failed</span>}
            </div>
            <span className="sub">of {results.length} total</span>
          </div>

          {failCount > 0 && (
            <table className="tbl tbl-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Status</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} style={!r.success ? { background: '#FEF2F2' } : undefined}>
                    <td className="sub mono">{r.index + 1}</td>
                    <td style={{ fontWeight: 600 }}>{r.name}</td>
                    <td className="mono sub" style={{ fontSize: 12 }}>{r.sku}</td>
                    <td>
                      {r.success
                        ? <span className="pill pill-green"><span className="dot" /> Created</span>
                        : <span className="pill pill-red"><span className="dot" /> Failed</span>
                      }
                    </td>
                    <td style={{ color: 'var(--c-red)', fontSize: 13 }}>{r.error || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {failCount === 0 && (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--c-green)' }}>
              <Icon name="check" size={40} />
              <div style={{ fontWeight: 600, marginTop: 8 }}>All {results.length} products created successfully!</div>
              <Link href="/admin/products" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
                View all products →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Categories Reference */}
      <div className="card card-pad" style={{ marginTop: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 12 }}>Category ID Reference</div>
        <p className="sub" style={{ marginBottom: 12, fontSize: 13 }}>
          Use these IDs in the <code>cat_id</code> column of your CSV or JSON:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {categories.map(c => (
            <span key={c.id} className="pill pill-blue" style={{ fontSize: 12 }}>
              {c.name}: <strong>{c.id}</strong>
            </span>
          ))}
          {categories.length === 0 && <span className="sub">Loading categories…</span>}
        </div>
      </div>
    </div>
  );
}
