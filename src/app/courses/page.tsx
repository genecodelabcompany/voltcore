'use client';
import { useState, useEffect } from 'react';
import { StoreShell } from '@/components/shells/store-shell';
import { StarRow } from '@/components/star-row';
import { money } from '@/lib/utils';
import Link from 'next/link';

interface Course {
  id: string; title: string; level: string; hours: number;
  price: number; enrolled: number; rating: number; instructor: string;
  glyph: string; cert: number; description: string;
}

const levelColor: Record<string, string> = { Beginner: 'pill-green', Intermediate: 'pill-amber', Advanced: 'pill-indigo' };
const EMOJIS = ['🔌', '⚡', '📡', '🤖', '🔧', '💾'];

export default function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(data => {
        setCourses(data.courses ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <StoreShell>
      {/* Hero */}
      <div className="courses-hero-section" style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, #1a3560 100%)',
        padding: '60px 40px', color: '#fff', textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block', background: 'rgba(255,255,255,.1)', borderRadius: 24,
          padding: '6px 16px', fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
          marginBottom: 16, color: '#93C5FD',
        }}>VoltCore Training Academy</div>
        <h1 style={{ fontSize: 38, fontWeight: 900, margin: '0 0 14px', lineHeight: 1.2 }}>
          Master Electronics Engineering
        </h1>
        <p style={{ fontSize: 16, opacity: .8, maxWidth: 520, margin: '0 auto 28px' }}>
          Practical, project-based courses taught by Ghana's leading electronics engineers.
          Learn at your own pace, earn certificates.
        </p>
        <div className="courses-hero-stats row gap12" style={{ justifyContent: 'center' }}>
          {[['500+', 'Students enrolled'], ['6', 'Expert-led courses'], ['100%', 'Project-based']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center', background: 'rgba(255,255,255,.1)', borderRadius: 12, padding: '16px 24px' }}>
              <div style={{ fontSize: 24, fontWeight: 900 }}>{v}</div>
              <div style={{ fontSize: 12, opacity: .75, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>All Courses</h2>
        {loading ? (
          <div className="sub" style={{ textAlign: 'center', padding: '48px 0' }}>Loading courses…</div>
        ) : (
          <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {courses.map((c, i) => (
              <div key={c.id} className="card" style={{ overflow: 'hidden' }}>
                <div style={{
                  background: `linear-gradient(135deg, var(--navy), ${['#1a56db','#0e7490','#7c3aed','#059669','#d97706','#db2777'][i % 6]})`,
                  padding: '32px 24px', textAlign: 'center', color: '#fff',
                }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>{EMOJIS[i % EMOJIS.length]}</div>
                  <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.4 }}>{c.title}</div>
                  <div style={{ fontSize: 13, opacity: .75, marginTop: 6 }}>{c.instructor}</div>
                </div>
                <div style={{ padding: '20px 20px' }}>
                  <div className="row gap8" style={{ marginBottom: 12 }}>
                    <span className={`pill ${levelColor[c.level] || 'pill-slate'}`} style={{ fontSize: 11 }}>{c.level}</span>
                    <span className="sub" style={{ fontSize: 12 }}>⏱ {c.hours} hrs</span>
                    <span className="sub" style={{ fontSize: 12 }}>👥 {c.enrolled.toLocaleString()}</span>
                  </div>
                  <div className="sub" style={{ fontSize: 13.5, lineHeight: 1.55, marginBottom: 16 }}>{c.description}</div>
                  <div className="row between" style={{ alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: 18, color: c.price === 0 ? 'var(--green)' : 'var(--blue-600)' }}>
                        {c.price === 0 ? 'Free' : money(c.price)}
                      </div>
                      <div className="row gap4" style={{ marginTop: 2 }}>
                        <StarRow rating={c.rating} size={12} />
                        <span className="sub" style={{ fontSize: 11 }}>{c.rating}</span>
                      </div>
                    </div>
                    <Link href={`/courses/${c.id}`} className="btn btn-primary btn-sm">
                      {c.price === 0 ? 'Enrol Free' : 'Enrol Now'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StoreShell>
  );
}
