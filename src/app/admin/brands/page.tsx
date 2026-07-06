'use client';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';

export default function BrandsPage() {
  return (
    <div>
      <PageHead title="Brands" sub="Manage product brands" actions={<Link href="/admin/brands/new" className="btn btn-primary"><Icon name="plus" size={16} /> Add Brand</Link>} />
      <div className="card card-pad" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
        <Icon name="tag" size={40} color="var(--line)" style={{ marginBottom: 16 }} />
        <div style={{ fontWeight: 700, marginTop: 16 }}>No brands yet</div>
      </div>
    </div>
  );
}
