'use client';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';

export default function LogsPage() {
  return (
    <div>
      <PageHead title="System Logs" sub="View system activity and error logs" />
      <div className="card card-pad" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
        <Icon name="doc" size={40} color="var(--line)" style={{ marginBottom: 16 }} />
        <div style={{ fontWeight: 700, marginTop: 16 }}>System logs</div>
      </div>
    </div>
  );
}
