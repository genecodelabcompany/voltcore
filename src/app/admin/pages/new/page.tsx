'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';

export default function AddStaticPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(true);
  };

  return (
    <div>
      <PageHead
        title="Create Page"
        sub="Add a new static page"
        actions={
          <Link href="/admin/pages" className="btn btn-ghost">
            <Icon name="chevL" size={16} /> Back to pages
          </Link>
        }
      />

      <div className="card card-pad">
        {success && (
          <div className="card card-pad" style={{ marginBottom: 18, background: '#ECFDF3', color: 'var(--c-green)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="check" size={18} />
              <div>Page created successfully. (Demo only.)</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Title</span>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Page title" required />
          </label>
          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Slug</span>
            <input className="input" value={slug} onChange={e => setSlug(e.target.value)} placeholder="page-slug" required />
          </label>
          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Content</span>
            <textarea className="input" style={{ minHeight: 180, resize: 'vertical' }} value={content} onChange={e => setContent(e.target.value)} placeholder="Page content" />
          </label>

          <div className="row gap12" style={{ justifyContent: 'flex-end' }}>
            <Link href="/admin/pages" className="btn btn-ghost">Cancel</Link>
            <button type="submit" className="btn btn-primary"><Icon name="plus" size={16} /> Create Page</button>
          </div>
        </form>
      </div>
    </div>
  );
}
