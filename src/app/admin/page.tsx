'use client';
import { useState, useEffect, useCallback } from 'react';

import Link from 'next/link';
import { KpiCard } from '@/components/kpi-card';
import { LineChart, Donut, Legend } from '@/components/charts';
import { CardHead } from '@/components/card-head';
import { VcSelect } from '@/components/vc-select';
import { ProductThumb } from '@/components/product-thumb';
import { Pill } from '@/components/pill';
import { Icon } from '@/components/icon';
import { money } from '@/lib/utils';
import { productById } from '@/lib/data';

interface AnalyticsData {
  orders: {
    total: number; pending: number; processing: number;
    shipped: number; delivered: number; cancelled: number;
    revenue: number; avg_order: number;
  };
  courses: {
    total_courses: number; enrollments: number; revenue: number;
  };
  services: { open_inquiries: number };
  products: { total: number; published: number; out_of_stock: number; low_stock: number };
  top_products: { id: string; name: string; sold: number; revenue: number }[];
  customer_count: number;
}

interface RecentOrder {
  id: string; customer_name: string; amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
}

const quickActions = [
  ['box', 'Add Product', 'var(--blue-600)', '/admin/products/new'],
  ['tags', 'Add Category', 'var(--c-green)', '/admin/categories'],
  ['cart', 'New Order', 'var(--c-orange)', '/admin/orders'],
  ['tags', 'Create Coupon', 'var(--c-purple)', '/admin/coupons'],
  ['image', 'Add Banner', 'var(--c-pink)', '/admin/banners'],
  ['bars', 'View Reports', 'var(--blue-600)', '/admin/analytics'],
] as const;

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [realtime, setRealtime] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [liveDot, setLiveDot] = useState(true);

  // Blinking live indicator
  useEffect(() => {
    const blink = setInterval(() => setLiveDot(d => !d), 1500);
    return () => clearInterval(blink);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [a, rt, o] = await Promise.all([
        fetch('/api/analytics').then(r => r.json()),
        fetch('/api/analytics/realtime').then(r => r.json()),
        fetch('/api/orders?limit=5').then(r => r.json()),
      ]);
      setAnalytics(a);
      setRealtime(rt);
      setRecentOrders(o.orders ?? []);
      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Poll every 30 seconds for real-time updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);


  if (loading || !analytics) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 20 }}>
        <h1 className="h1">Loading Dashboard…</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card card-pad" style={{ height: 120, background: 'var(--surface-2)' }} />
          ))}
        </div>
      </div>
    );
  }

  const kpis = [
    { icon: 'shop',   bg: 'var(--blue-50)', c: 'var(--blue-600)', label: 'Total Sales',      value: money(analytics.orders.revenue),        spark: [8,10,9,13,11,14,12,15], sc: 'var(--c-blue)' },
    { icon: 'cart',   bg: '#ECFDF3',        c: 'var(--c-green)',  label: 'Total Orders',     value: String(analytics.orders.total),         spark: [9,11,10,12,11,13,12,14], sc: 'var(--c-green)' },
    { icon: 'users',  bg: '#F5F3FF',        c: 'var(--c-purple)', label: 'Customers',        value: String(analytics.customer_count ?? 0),  spark: [7,8,10,9,11,12,13,14],  sc: 'var(--c-purple)' },
    { icon: 'box',    bg: '#FFF7ED',        c: 'var(--c-orange)', label: 'Products',         value: String(analytics.products.total),       spark: [10,11,10,12,11,12,13,13], sc: 'var(--c-orange)' },
    { icon: 'shield', bg: '#FEF2F2',        c: 'var(--c-red)',    label: 'Low Stock Items',  value: String(analytics.products.low_stock),   spark: [14,12,13,11,12,10,11,9],  sc: 'var(--c-red)' },
  ];

  const bottomKpis = [
    { icon: 'card',   bg: '#F5F3FF', c: 'var(--c-purple)', label: 'Total Revenue',   value: money(analytics.orders.revenue) },
    { icon: 'user',   bg: '#ECFDF3', c: 'var(--c-green)',  label: 'Active Students', value: String(analytics.courses.enrollments) },
    { icon: 'refund', bg: '#FFF7ED', c: 'var(--c-orange)', label: 'Total Courses',   value: String(analytics.courses.total_courses) },
    { icon: 'cap',    bg: 'var(--blue-50)', c: 'var(--blue-600)', label: 'Course Revenue', value: money(analytics.courses.revenue) },
    { icon: 'doc',    bg: '#FEF2F2', c: 'var(--c-red)',    label: 'Service Inquiries', value: String(analytics.services.open_inquiries) },
  ];

  const orderStatusDist = analytics.orders.total > 0
    ? [
        { name: 'Pending',    count: analytics.orders.pending,    pct: (analytics.orders.pending    / analytics.orders.total) * 100, color: 'var(--c-orange)' },
        { name: 'Processing', count: analytics.orders.processing, pct: (analytics.orders.processing / analytics.orders.total) * 100, color: 'var(--c-blue)' },
        { name: 'Shipped',    count: analytics.orders.shipped,    pct: (analytics.orders.shipped    / analytics.orders.total) * 100, color: 'var(--c-green)' },
        { name: 'Delivered',  count: analytics.orders.delivered,  pct: (analytics.orders.delivered  / analytics.orders.total) * 100, color: 'var(--c-purple)' },
        { name: 'Cancelled',  count: analytics.orders.cancelled,  pct: (analytics.orders.cancelled  / analytics.orders.total) * 100, color: 'var(--c-red)' },
      ]
    : [
        { name: 'No Orders', count: 0, pct: 100, color: 'var(--line)' },
      ];

  const categorySales = [
    { name: 'Arduino MCU', pct: 35, val: money(analytics.orders.revenue * 0.35), color: 'var(--c-blue)' },
    { name: 'Sensors',     pct: 22, val: money(analytics.orders.revenue * 0.22), color: 'var(--c-green)' },
    { name: 'Modules',     pct: 18, val: money(analytics.orders.revenue * 0.18), color: 'var(--c-purple)' },
    { name: 'Power',       pct: 10, val: money(analytics.orders.revenue * 0.10), color: 'var(--c-orange)' },
    { name: 'ICs',         pct: 8,  val: money(analytics.orders.revenue * 0.08), color: 'var(--c-pink)' },
    { name: 'Tools',       pct: 7,  val: money(analytics.orders.revenue * 0.07), color: 'var(--c-teal)' },
  ];

  const salesSeries = [0, 0, 0, 0, 0, 0, 0];
  const salesDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="row between" style={{ flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="h1">Welcome back, Admin!</h1>
          <div className="sub" style={{ marginTop: 6, fontSize: 15 }}>Here's what's happening with your store today.</div>
        </div>
        <div className="row gap12" style={{ alignItems: 'center' }}>
          <div className="card row gap8" style={{ padding: '10px 16px', fontWeight: 600, fontSize: 14 }}>
            <span style={{
              width: 10, height: 10, borderRadius: '50%',
              background: liveDot ? 'var(--c-green)' : 'var(--c-green)',
              opacity: liveDot ? 1 : 0.3,
              transition: 'opacity 0.3s',
            }} />
            Live
          </div>
          {lastUpdated && (
            <span className="sub" style={{ fontSize: 12 }}>Updated {lastUpdated}</span>
          )}
        </div>
      </div>

      {/* Live Today's Stats */}
      {realtime && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          <div className="card card-pad" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)', color: '#fff' }}>
            <div className="sub" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Today's Revenue</div>
            <div style={{ fontSize: 28, fontWeight: 900, marginTop: 4 }}>{money(realtime.today.revenue)}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
              {realtime.today.orders} order{realtime.today.orders !== 1 ? 's' : ''} today
            </div>
          </div>
          <div className="card card-pad" style={{ background: 'linear-gradient(135deg, #065F46 0%, #059669 100%)', color: '#fff' }}>
            <div className="sub" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Today's Orders</div>
            <div style={{ fontSize: 28, fontWeight: 900, marginTop: 4 }}>{realtime.today.orders}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
              {realtime.pending_orders} pending
            </div>
          </div>
          <div className="card card-pad" style={{ background: 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)', color: '#fff' }}>
            <div className="sub" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>New Customers Today</div>
            <div style={{ fontSize: 28, fontWeight: 900, marginTop: 4 }}>{realtime.today.new_customers}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>unique buyers</div>
          </div>
          <div className="card card-pad" style={{ background: 'linear-gradient(135deg, #B45309 0%, #F59E0B 100%)', color: '#fff' }}>
            <div className="sub" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Pending Orders</div>
            <div style={{ fontSize: 28, fontWeight: 900, marginTop: 4 }}>{realtime.pending_orders}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>need attention</div>
          </div>
        </div>
      )}


      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16 }}>
        {kpis.map((k, i) => (
          <KpiCard key={i} icon={k.icon} iconBg={k.bg} iconColor={k.c} label={k.label}
            value={k.value} spark={k.spark} sparkColor={k.sc} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr 1fr', gap: 16 }}>
        <div className="card card-pad">
          <CardHead title="Sales Overview" right={<VcSelect value="This Week" options={['This Week', 'This Month', 'This Quarter']} />} />
          <LineChart data={salesSeries} labels={salesDays} />
        </div>
        <div className="card card-pad">
          <CardHead title="Sales by Category" />
          <div className="row gap16" style={{ alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}>
              <Donut data={categorySales} size={150} thickness={26}
                center={{ top: 'Revenue', main: analytics.orders.revenue > 0 ? money(analytics.orders.revenue).split('.')[0] : '0' }} />
            </div>
            <div className="grow"><Legend data={categorySales} /></div>
          </div>
        </div>
        <div className="card card-pad">
          <CardHead title="Order Status" />
          <div className="row gap16" style={{ alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}>
              <Donut data={orderStatusDist} size={150} thickness={26}
                center={{ top: 'Total Orders', main: String(analytics.orders.total) }} />
            </div>
            <div className="grow"><Legend data={orderStatusDist} showVal /></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 1fr', gap: 16 }}>
        <div className="card card-pad">
          <CardHead title="Recent Orders" action="View All Orders" onAction={() => {}} />
          {recentOrders.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0', fontSize: 14 }}>
              No orders yet
            </div>
          ) : (
            <table className="tbl tbl-hover">
              <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th><th /></tr></thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id}>
                    <td className="mono" style={{ fontWeight: 600, fontSize: 13 }}>#{o.id}</td>
                    <td style={{ fontWeight: 600 }}>{o.customer_name}</td>
                    <td style={{ fontWeight: 600 }}>{money(o.amount)}</td>
                    <td><Pill status={o.status} /></td>
                    <td className="sub" style={{ fontSize: 13 }}>
                      {new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td><Link href="/admin/orders" className="link"><Icon name="eye" size={18} /></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card card-pad">
          <CardHead title="Top Selling Products" />
          {analytics.top_products.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0', fontSize: 14 }}>
              No sales data yet
            </div>
          ) : (
            <table className="tbl">
              <thead><tr><th>Product</th><th>Sold</th><th>Revenue</th></tr></thead>
              <tbody>
                {analytics.top_products.map(p => {
                  const pr = productById(p.id);
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="row gap12">
                          <ProductThumb glyph={pr?.glyph || 'chip'} size={38} />
                          <span style={{ fontWeight: 600, fontSize: 13.5 }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{p.sold}</td>
                      <td style={{ fontWeight: 700 }}>{money(p.revenue)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="card card-pad">
          <h3 className="h3" style={{ marginBottom: 18 }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {quickActions.map(([ic, label, c, href]) => (
              <Link key={label} href={href} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 9, padding: '18px 8px', border: '1px solid var(--line)', borderRadius: 12, transition: 'all .15s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c; (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; (e.currentTarget as HTMLElement).style.background = '#fff'; }}>
                <div style={{ color: c }}><Icon name={ic} size={24} /></div>
                <span style={{ fontSize: 12.5, fontWeight: 600, textAlign: 'center' }}>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16 }}>
        {bottomKpis.map((k, i) => (
          <div key={i} className="card card-pad row gap12" style={{ alignItems: 'flex-start' }}>
            <div style={{
              width: 42, height: 42, borderRadius: 11, background: k.bg, color: k.c,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon name={k.icon} size={20} />
            </div>
            <div className="grow" style={{ minWidth: 0 }}>
              <div className="sub" style={{ fontSize: 12.5 }}>{k.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 3 }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
