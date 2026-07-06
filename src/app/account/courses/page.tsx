'use client';
import { useState, useEffect } from 'react';
import { Icon } from '@/components/icon';
import { money } from '@/lib/utils';
import Link from 'next/link';

interface Course {
  id: string; title: string; level: string; hours: number; duration?: string;
  price: number; enrolled: number; rating: number; instructor: string;
  glyph: string; cert: number; status: string; description: string;
}

const EMOJIS = ['🔌', '⚡', '📡', '🤖', '🔧', '💾'];

export default function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(data => {
        setCourses((data.courses ?? []).slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>My Courses</h2>
          <div className="sub" style={{ marginTop: 4 }}>Continue your electronics engineering journey</div>
        </div>
        <div className="sub" style={{ textAlign: 'center', padding: '40px 0' }}>Loading courses…</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>My Courses</h2>
        <div className="sub" style={{ marginTop: 4 }}>Continue your electronics engineering journey</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {courses.map((c, i) => (
          <div key={c.id} className="card card-pad">
            <div style={{
              background: 'linear-gradient(135deg, var(--navy), var(--blue-600))',
              borderRadius: 'var(--r)', padding: '28px 20px', marginBottom: 16, textAlign: 'center', color: '#fff',
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{EMOJIS[i % EMOJIS.length]}</div>
              <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.4 }}>{c.title}</div>
            </div>
            <div className="sub" style={{ fontSize: 12, marginBottom: 14 }}>
              {c.instructor} · {c.level} · {c.hours} hrs
            </div>
            <div className="row between" style={{ alignItems: 'center' }}>
              <div className="sub" style={{ fontSize: 12 }}><Icon name="clock" size={13} /> {c.hours} hrs</div>
              <Link href="/courses" className="btn btn-primary btn-sm">Browse Courses</Link>
            </div>
          </div>
        ))}
        <Link href="/courses" style={{ textDecoration: 'none' }}>
          <div className="card card-pad" style={{
            border: '2px dashed var(--line)', background: 'transparent',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '60px 20px', color: 'var(--muted)', textAlign: 'center', cursor: 'pointer',
          }}>
            <Icon name="plus" size={28} color="var(--muted)" />
            <div style={{ fontWeight: 600, marginTop: 12 }}>Browse More Courses</div>
            <div className="sub" style={{ fontSize: 13, marginTop: 4 }}>Expand your engineering skills</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
