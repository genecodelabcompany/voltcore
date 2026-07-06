'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { KpiCard } from '@/components/kpi-card';
import { Pill } from '@/components/pill';
import { Icon } from '@/components/icon';
import { CardHead } from '@/components/card-head';
import { money } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import { useStore } from '@/context/store-context';

interface Order {
  id: string; amount: number; status: string; created_at: string; item_count: number;
}

const quickActions = [
  { label: 'Track Order', icon: 'truck', href: '/account/orders' },
  { label: 'My Wishlist', icon: 'heart', href: '/wishlist' },
  { label: 'Support', icon: 'chat', href: '/account/support' },
  { label: 'Downloads', icon: 'download', href: '/account/downloads' },
  { label: 'My Courses', icon: 'book', href: '/account/courses' },
  { label: 'Profile', icon: 'user', href: '/account/details' },
];

export default function CustomerDashboard() {
  const { user } = useUser();
  const { wishlist } = useStore();
  const firstName = user?.firstName || 'Customer';
  const [orders, setOrders] = useState<Order[]>([]);
  const [courseCount, setCourseCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/orders?limit=4').then(r => r.json()),
      fetch('/api/courses').then(r => r.json()),
    ]).then(([ordersData, coursesData]) => {
      setOrders(ordersData.orders ?? []);
      setCourseCount((coursesData.courses ?? []).length);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Hello, {firstName} 👋</h1>
        <div className="sub" style={{ marginTop: 4 }}>Welcome back to your VoltCore account.</div>
      </div>
      <div className="dash-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <KpiCard icon="cart"  iconBg="#EFF6FF" iconColor="var(--blue-600)" label="Orders"         value={String(orders.length)} spark={[2,3,2,4,3,5,4]} sparkColor="var(--c-blue)" />
        <KpiCard icon="heart" iconBg="#FFF1F2" iconColor="var(--c-red)"   label="Wishlist Items" value={String(wishlist.length)} spark={[3,4,5,4,6,7,8]} sparkColor="var(--c-red)" />
        <KpiCard icon="book"  iconBg="#F5F3FF" iconColor="var(--c-purple)" label="Courses"       value={String(courseCount)} spark={[1,2,2,3,3,4,4]} sparkColor="var(--c-purple)" />
        <KpiCard icon="star"  iconBg="#FFF7ED" iconColor="var(--c-orange)" label="Reward Points" value="840" spark={[200,300,400,500,600,720,840]} sparkColor="var(--c-orange)" />
      </div>
      <div className="dash-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="card card-pad">
          <CardHead title="Recent Orders" right={<Link href="/account/orders" className="link" style={{ fontSize: 13 }}>View all</Link>} />
          {loading ? (
            <div className="sub" style={{ textAlign: 'center', padding: '20px 0' }}>Loading orders…</div>
          ) : orders.length === 0 ? (
            <div className="sub" style={{ textAlign: 'center', padding: '20px 0' }}>No orders yet</div>
          ) : (
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr><th>Order</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td className="mono" style={{ fontWeight: 600, fontSize: 13 }}>#{o.id}</td>
                      <td className="sub" style={{ fontSize: 13 }}>{o.item_count ?? 1} item{(o.item_count ?? 1) > 1 ? 's' : ''}</td>
                      <td style={{ fontWeight: 700 }}>{money(o.amount)}</td>
                      <td><Pill status={o.status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="card card-pad">
          <CardHead title="Quick Actions" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {quickActions.map(a => (
              <Link key={a.href} href={a.href} className="row gap10" style={{
                padding: '12px 14px', borderRadius: 'var(--r)', border: '1px solid var(--line)',
                textDecoration: 'none', color: 'var(--ink)', fontWeight: 600, fontSize: 13.5,
                transition: 'border-color .15s',
              }}>
                <Icon name={a.icon as 'cart'} size={18} color="var(--blue-600)" />
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
