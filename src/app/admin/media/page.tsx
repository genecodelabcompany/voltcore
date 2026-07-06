'use client';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';

export default function MediaLibraryPage() {
  return (
    <div>
      <PageHead title="Media Library" sub="Manage uploaded media files" />
      <div className="card card-pad" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
        <Icon name="image" size={40} color="var(--line)" style={{ marginBottom: 16 }} />
        <div style={{ fontWeight: 700, marginTop: 16 }}>No media files yet</div>
      </div>
    </div>
  );
}
