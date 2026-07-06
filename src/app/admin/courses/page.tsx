'use client';
import { useState, useEffect } from 'react';
import { PageHead } from '@/components/page-head';
import { MiniStat } from '@/components/mini-stat';
import { Icon } from '@/components/icon';
import { money } from '@/lib/utils';

interface Course {
  id: string; title: string; level: string; hours: number; duration?: string;
  price: number; enrolled: number; rating: number; instructor: string;
  glyph: string; cert: number; status: string; created_at: string;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, published: 0, total_enrolled: 0, total_revenue: 0 });

  useEffect(() => {
    Promise.all([
      fetch('/api/courses').then(r => r.json()),
      fetch('/api/analytics').then(r => r.json()),
    ]).then(([courseData, analyticsData]) => {
      setCourses(courseData.courses ?? []);
      if (analyticsData.courses) setStats(analyticsData.courses);
      setLoading(false);
    });
  }, []);

  const rows = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHead title="Training Courses" sub="Manage the VoltCore e-learning catalogue"
        actions={<>
          <button className="btn btn-ghost"><Icon name="download" size={16} />Export</button>
          <button className="btn btn-primary"><Icon name="plus" size={16} />New Course</button>
        </>} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <MiniStat label="Total Courses" value={String(stats.total)} />
        <MiniStat label="Published" value={String(stats.published)} c="var(--c-blue)" />
        <MiniStat label="Total Enrolled" value={stats.total_enrolled.toLocaleString()} c="var(--c-green)" />
        <MiniStat label="Course Revenue" value={money(stats.total_revenue)} />
      </div>

      <div className="card card-pad">
        <div className="row between" style={{ marginBottom: 16 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>
              <Icon name="search" size={16} />
            </span>
            <input className="input" placeholder="Search courses…" value={search}
              onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34, width: 280 }} />
          </div>
        </div>

        {loading ? (
          <div className="sub" style={{ textAlign: 'center', padding: '48px 0' }}>Loading courses…</div>
        ) : (
          <table className="tbl tbl-hover">
            <thead><tr><th>Title</th><th>Level</th><th>Duration</th><th>Price</th><th>Students</th><th>Rating</th><th>Status</th><th /></tr></thead>
            <tbody>
              {rows.map(c => (
                <tr key={c.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{c.title}</div>
                      <div className="sub" style={{ fontSize: 12, marginTop: 2 }}>{c.instructor}</div>
                    </div>
                  </td>
                  <td><span className="pill pill-indigo" style={{ fontSize: 11 }}>{c.level}</span></td>
                  <td className="sub" style={{ fontSize: 13 }}>{c.hours} hrs</td>
                  <td style={{ fontWeight: 700 }}>{c.price === 0 ? <span className="pill pill-green">Free</span> : money(c.price)}</td>
                  <td style={{ fontWeight: 600 }}>{c.enrolled.toLocaleString()}</td>
                  <td><span style={{ fontWeight: 700, color: 'var(--c-orange)', fontSize: 13 }}>★ {c.rating}</span></td>
                  <td><span className={`pill ${c.status === 'published' ? 'pill-green' : 'pill-slate'}`}><span className="dot" />{c.status}</span></td>
                  <td>
                    <div className="row gap6">
                      <button className="btn btn-ghost btn-sm">Edit</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--muted)' }}>
                        <Icon name="eye" size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>No courses found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
