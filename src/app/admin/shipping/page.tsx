'use client';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';

export default function ShippingPage() {
  return (
    <div>
      <PageHead title="Shipping Settings" sub="Configure shipping methods and rates" />
      <div className="card card-pad" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
        <Icon name="box" size={40} color="var(--line)" style={{ marginBottom: 16 }} />
        <div style={{ fontWeight: 700, marginTop: 16 }}>Shipping configuration</div>
      </div>
    </div>
  );
}
