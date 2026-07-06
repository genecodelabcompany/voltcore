'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';

export default function AddBlogPostPage() {
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
        title="Create Blog Post"
        sub="Add a new blog article"
        actions={
          <Link href="/admin/blog" className="btn btn-ghost">
            <Icon name="chevL" size={16} /> Back to posts
          </Link>
        }
      />

      <div className="card card-pad">
        {success && (
          <div className="card card-pad" style={{ marginBottom: 18, background: '#ECFDF3', color: 'var(--c-green)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="check" size={18} />
              <div>Blog post created successfully. (Demo only.)</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Title</span>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title" required />
          </label>
          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Slug</span>
            <input className="input" value={slug} onChange={e => setSlug(e.target.value)} placeholder="post-slug" required />
          </label>
          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Content</span>
            <textarea className="input" style={{ minHeight: 180, resize: 'vertical' }} value={content} onChange={e => setContent(e.target.value)} placeholder="Blog content" />
          </label>

          <div className="row gap12" style={{ justifyContent: 'flex-end' }}>
            <Link href="/admin/blog" className="btn btn-ghost">Cancel</Link>
            <button type="submit" className="btn btn-primary"><Icon name="plus" size={16} /> Publish Post</button>
          </div>
        </form>
      </div>
    </div>
  );
}
