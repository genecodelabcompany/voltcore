'use client';
import { useState, useEffect } from 'react';
import { KpiCard } from '@/components/kpi-card';
import { LineChart, Donut, Legend } from '@/components/charts';
import { CardHead } from '@/components/card-head';
import { VcSelect } from '@/components/vc-select';
import { ProductThumb } from '@/components/product-thumb';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';
import { money } from '@/lib/utils';
import { productById } from '@/lib/data';

interface Analytics {
  orders: { total: number; revenue: number; avg_order: number; pending: number; processing: number; shipped: number; delivered: number; cancelled: number };
  courses: { total_courses: number; enrollments: number; revenue: number };
  products: { total: number; low_stock: number; out_of_stock: number };
  top_products: { id: string; name: string; sold: number; revenue: number }[];
  customer_count: number;
}

export default function AdminAnalytics() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(setData);
  }, []);

  if (!data) {
    return (
      <div>
        <PageHead title="Reports & Analytics" sub="Revenue, orders and customer growth insights" />
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)' }}>Loading analytics…</div>
      </div>
    );
  }

  const orderStatusDist = data.orders.total > 0
    ? [
        { name: 'Pending',    count: data.orders.pending,    pct: (data.orders.pending    / data.orders.total) * 100, color: 'var(--c-orange)' },
        { name: 'Processing', count: data.orders.processing, pct: (data.orders.processing / data.orders.total) * 100, color: 'var(--c-blue)' },
        { name: 'Shipped',    count: data.orders.shipped,    pct: (data.orders.shipped    / data.orders.total) * 100, color: 'var(--c-green)' },
        { name: 'Delivered',  count: data.orders.delivered,  pct: (data.orders.delivered  / data.orders.total) * 100, color: 'var(--c-purple)' },
        { name: 'Cancelled',  count: data.orders.cancelled,  pct: (data.orders.cancelled  / data.orders.total) * 100, color: 'var(--c-red)' },
      ]
    : [{ name: 'No orders yet', count: 0, pct: 100, color: 'var(--line)' }];

  const categorySales = [
    { name: 'Arduino MCU', pct: 35, val: money(data.orders.revenue * 0.35), color: 'var(--c-blue)' },
    { name: 'Sensors',     pct: 22, val: money(data.orders.revenue * 0.22), color: 'var(--c-green)' },
    { name: 'Modules',     pct: 18, val: money(data.orders.revenue * 0.18), color: 'var(--c-purple)' },
    { name: 'Power',       pct: 10, val: money(data.orders.revenue * 0.10), color: 'var(--c-orange)' },
    { name: 'ICs',         pct:  8, val: money(data.orders.revenue * 0.08), color: 'var(--c-pink)' },
    { name: 'Tools',       pct:  7, val: money(data.orders.revenue * 0.07), color: 'var(--c-teal)' },
  ];

  return (
    <div>
      <PageHead title="Reports & Analytics" sub="Revenue, orders and customer growth insights"
        actions={<>
          <VcSelect value="All Time" options={['All Time', 'Last 30 Days', 'This Quarter', 'This Year']} />
          <button className="btn btn-primary"><Icon name="download" size={16} />Export Report</button>
        </>} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <KpiCard icon="card"  iconBg="var(--blue-50)" iconColor="var(--blue-600)" label="Revenue"         value={money(data.orders.revenue)}             spark={[0,0,0,0,0,0,0]} sparkColor="var(--c-blue)" />
        <KpiCard icon="cart"  iconBg="#ECFDF3"        iconColor="var(--c-green)"  label="Orders"          value={String(data.orders.total)}              spark={[0,0,0,0,0,0,0]} sparkColor="var(--c-green)" />
        <KpiCard icon="users" iconBg="#F5F3FF"        iconColor="var(--c-purple)" label="Customers"       value={String(data.customer_count)}            spark={[0,0,0,0,0,0,0]} sparkColor="var(--c-purple)" />
        <KpiCard icon="trend" iconBg="#FFF7ED"        iconColor="var(--c-orange)" label="Avg Order Value" value={money(data.orders.avg_order)}           spark={[0,0,0,0,0,0,0]} sparkColor="var(--c-orange)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="card card-pad">
          <CardHead title="Revenue Trend" right={<VcSelect value="Daily" options={['Daily', 'Weekly', 'Monthly']} />} />
          <LineChart data={[0, 0, 0, 0, 0, 0, 0]} labels={['Mon','Tue','Wed','Thu','Fri','Sat','Sun']} color="var(--c-blue)" />
        </div>
        <div className="card card-pad">
          <CardHead title="Top Products by Revenue" />
          {data.top_products.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0', fontSize: 14 }}>No sales data yet</div>
          ) : (
            data.top_products.map((p, i) => {
              const pr = productById(p.id);
              const maxSold = data.top_products[0]?.sold || 1;
              return (
                <div key={p.id} style={{ marginBottom: 16 }}>
                  <div className="row between" style={{ marginBottom: 6 }}>
                    <span className="row gap8" style={{ fontSize: 13.5, fontWeight: 600 }}>
                      <ProductThumb glyph={pr?.glyph || 'chip'} size={28} />{p.name}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{money(p.revenue)}</span>
                  </div>
                  <div style={{ height: 7, background: 'var(--line)', borderRadius: 99 }}>
                    <div style={{
                      width: (p.sold / maxSold * 100) + '%', height: '100%', borderRadius: 99,
                      background: ['var(--c-blue)','var(--c-green)','var(--c-purple)','var(--c-orange)','var(--c-pink)'][i],
                    }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card card-pad">
          <CardHead title="Sales by Category" />
          <div className="row gap24" style={{ alignItems: 'center' }}>
            <Donut data={categorySales} size={170} thickness={28}
              center={{ top: 'Revenue', main: data.orders.revenue > 0 ? money(data.orders.revenue).split('.')[0] : 'GHS 0' }} />
            <div className="grow"><Legend data={categorySales} /></div>
          </div>
        </div>
        <div className="card card-pad">
          <CardHead title="Order Status Distribution" />
          <div className="row gap24" style={{ alignItems: 'center' }}>
            <Donut data={orderStatusDist} size={170} thickness={28}
              center={{ top: 'Orders', main: String(data.orders.total) }} />
            <div className="grow"><Legend data={orderStatusDist} showVal /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
