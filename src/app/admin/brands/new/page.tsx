'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';

export default function AddBrandPage() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(true);
  };

  return (
    <div>
      <PageHead
        title="Add Brand"
        sub="Create a new product brand"
        actions={
          <Link href="/admin/brands" className="btn btn-ghost">
            <Icon name="chevL" size={16} /> Back to brands
          </Link>
        }
      />

      <div className="card card-pad">
        {success && (
          <div className="card card-pad" style={{ marginBottom: 18, background: '#ECFDF3', color: 'var(--c-green)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="check" size={18} />
              <div>Brand created successfully. (Demo only.)</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Brand Name</span>
              <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Enter brand name" required />
            </label>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Slug</span>
              <input className="input" value={slug} onChange={e => setSlug(e.target.value)} placeholder="brand-slug" required />
            </label>
          </div>

          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Description</span>
            <textarea className="input" style={{ minHeight: 120, resize: 'vertical' }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter an optional description" />
          </label>

          <div className="row gap12" style={{ justifyContent: 'flex-end' }}>
            <Link href="/admin/brands" className="btn btn-ghost">Cancel</Link>
            <button type="submit" className="btn btn-primary"><Icon name="plus" size={16} /> Create Brand</button>
          </div>
        </form>
      </div>
    </div>
  );
}
