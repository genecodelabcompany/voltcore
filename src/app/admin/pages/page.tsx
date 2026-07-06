'use client';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';

export default function PagesPage() {
  return (
    <div>
      <PageHead title="Pages" sub="Manage static pages" actions={<Link href="/admin/pages/new" className="btn btn-primary"><Icon name="plus" size={16} /> Create Page</Link>} />
      <div className="card card-pad" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
        <Icon name="doc" size={40} color="var(--line)" style={{ marginBottom: 16 }} />
        <div style={{ fontWeight: 700, marginTop: 16 }}>No pages yet</div>
      </div>
    </div>
  );
}
