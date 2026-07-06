'use client';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';

export default function UsersPage() {
  return (
    <div>
      <PageHead title="Users & Roles" sub="Manage admin users and roles" actions={<Link href="/admin/users/new" className="btn btn-primary"><Icon name="plus" size={16} /> Add User</Link>} />
      <div className="card card-pad" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
        <Icon name="users" size={40} color="var(--line)" style={{ marginBottom: 16 }} />
        <div style={{ fontWeight: 700, marginTop: 16 }}>No users yet</div>
      </div>
    </div>
  );
}
