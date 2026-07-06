'use client';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';

export default function TrainingInquiriesPage() {
  return (
    <div>
      <PageHead title="Training Inquiries" sub="View training program inquiries" />
      <div className="card card-pad" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
        <Icon name="mail" size={40} color="var(--line)" style={{ marginBottom: 16 }} />
        <div style={{ fontWeight: 700, marginTop: 16 }}>No inquiries yet</div>
      </div>
    </div>
  );
}
