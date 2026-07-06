'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';

export default function AddUserPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Admin');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(true);
  };

  return (
    <div>
      <PageHead
        title="Add User"
        sub="Create a new admin user"
        actions={
          <Link href="/admin/users" className="btn btn-ghost">
            <Icon name="chevL" size={16} /> Back to users
          </Link>
        }
      />

      <div className="card card-pad">
        {success && (
          <div className="card card-pad" style={{ marginBottom: 18, background: '#ECFDF3', color: 'var(--c-green)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="check" size={18} />
              <div>User created successfully. (Demo only.)</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Name</span>
              <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required />
            </label>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Email</span>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" required />
            </label>
          </div>

          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Role</span>
            <select className="input" value={role} onChange={e => setRole(e.target.value)}>
              <option>Admin</option>
              <option>Editor</option>
              <option>Viewer</option>
            </select>
          </label>

          <div className="row gap12" style={{ justifyContent: 'flex-end' }}>
            <Link href="/admin/users" className="btn btn-ghost">Cancel</Link>
            <button type="submit" className="btn btn-primary"><Icon name="plus" size={16} /> Add User</button>
          </div>
        </form>
      </div>
    </div>
  );
}
