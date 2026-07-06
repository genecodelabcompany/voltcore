'use client';
import { useState } from 'react';
import { PageHead } from '@/components/page-head';
import { MiniStat } from '@/components/mini-stat';
import { ProductThumb } from '@/components/product-thumb';
import { StarRow } from '@/components/star-row';
import { Icon } from '@/components/icon';
import { productById } from '@/lib/data';

const seed = [
  ['uno-r3','Kwame Mensah',5,'Excellent quality, fast delivery in Accra. Works perfectly.','pending','2h ago'],
  ['esp32','Akosua Boateng',4,'Good value for money. Packaging could be better.','pending','5h ago'],
  ['dht22','Yaw Darko',2,'Sensor readings were off by a few degrees out of the box.','pending','1d ago'],
  ['multim','Abena Osei',5,'Genuine component, tested on arrival. Will buy again.','approved','2d ago'],
  ['solderk','Kofi Owusu',5,'Great starter kit, heats up fast. Recommended.','approved','3d ago'],
  ['hcsr04','Ama Serwaa',1,'Arrived damaged, one pin bent. Requesting replacement.','flagged','4d ago'],
  ['li18650','Nana Yeboah',4,'Holds charge well. Shipping was a day late though.','approved','5d ago'],
] as const;

const tabs: Record<string, string> = { Pending: 'pending', Approved: 'approved', Flagged: 'flagged' };
const pillFor: Record<string, string> = { pending: 'pill-amber', approved: 'pill-green', flagged: 'pill-red' };

export default function AdminReviews() {
  const [tab, setTab] = useState('Pending');
  const rows = seed.filter(r => r[4] === tabs[tab]);

  return (
    <div>
      <PageHead title="Reviews" sub="Moderate and respond to customer product reviews"
        actions={<button className="btn btn-ghost"><Icon name="download" size={16} />Export</button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <MiniStat label="Average Rating" value="4.7 ★" c="var(--c-orange)" />
        <MiniStat label="Pending Moderation" value="3" c="var(--amber)" />
        <MiniStat label="Total Reviews" value="1,284" />
        <MiniStat label="Flagged" value="1" c="var(--c-red)" />
      </div>
      <div className="card card-pad">
        <div className="row gap8" style={{ marginBottom: 18 }}>
          {Object.keys(tabs).map(t => (
            <button key={t} onClick={() => setTab(t)} className="btn btn-sm" style={{
              background: tab === t ? 'var(--blue-600)' : 'var(--surface-2)',
              color: tab === t ? '#fff' : 'var(--ink-2)',
              border: `1px solid ${tab === t ? 'var(--blue-600)' : 'var(--line)'}`,
            }}>{t}</button>
          ))}
        </div>
        {rows.length === 0 && <div className="sub" style={{ padding: '32px 0', textAlign: 'center' }}>No {tab.toLowerCase()} reviews.</div>}
        {rows.map((r, i) => {
          const p = productById(r[0]);
          return (
            <div key={i} className="row gap16" style={{ padding: '18px 0', borderBottom: i < rows.length - 1 ? '1px solid var(--line-2)' : 'none', alignItems: 'flex-start' }}>
              <ProductThumb glyph={p?.glyph || 'chip'} size={48} />
              <div className="grow" style={{ minWidth: 0 }}>
                <div className="row gap12" style={{ flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{r[1]}</span>
                  <StarRow rating={r[2]} size={13} />
                  <span className={`pill ${pillFor[r[4]]}`} style={{ fontSize: 11 }}>{r[4]}</span>
                  <span className="sub" style={{ fontSize: 12 }}>· {p?.name || r[0]} · {r[5]}</span>
                </div>
                <p className="sub" style={{ marginTop: 7, lineHeight: 1.55, fontSize: 13.5 }}>{r[3]}</p>
              </div>
              <div className="row gap8" style={{ flexShrink: 0 }}>
                {r[4] !== 'approved' && <button className="btn btn-soft btn-sm"><Icon name="check" size={15} />Approve</button>}
                <button className="btn btn-ghost btn-sm">Reply</button>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', borderColor: 'var(--red-bg)' }}>Remove</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
