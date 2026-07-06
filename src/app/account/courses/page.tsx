'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/icon';
import { useUser } from '@clerk/nextjs';

interface Enrollment {
  id: string; course_id: string; course_title: string; progress: number;
  enrolled_at: string; completed: number;
}

const EMOJIS = ['🔌', '⚡', '📡', '🤖', '🔧', '💾'];

export default function MyCourses() {
  const { user } = useUser();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/enrollments')
      .then(r => r.json())
      .then(data => {
        setEnrollments(data.enrollments ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const fmt = (dt: string) => {
    try { return new Date(dt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return dt; }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>My Courses</h2>
        <div className="sub" style={{ marginTop: 4 }}>Continue learning where you left off</div>
      </div>
      {loading ? (
        <div className="sub" style={{ textAlign: 'center', padding: '40px 0' }}>Loading courses…</div>
      ) : enrollments.length === 0 ? (
        <div className="card card-pad" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          <Icon name="book" size={40} color="var(--line)" />
          <div style={{ fontWeight: 700, marginTop: 16, marginBottom: 8 }}>No courses yet</div>
          <div className="sub" style={{ fontSize: 13, marginBottom: 20 }}>Enrol in a course to get started.</div>
          <Link href="/courses" className="btn btn-primary">Browse Courses</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {enrollments.map((e, i) => (
            <div key={e.id} className="card card-pad">
              <div className="row gap16" style={{ alignItems: 'flex-start' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 'var(--r)', background: 'var(--surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0,
                }}>{EMOJIS[i % EMOJIS.length]}</div>
                <div className="grow">
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{e.course_title}</div>
                  <div className="sub" style={{ fontSize: 12, marginTop: 2 }}>Enrolled {fmt(e.enrolled_at)}</div>
                  <div className="row gap10" style={{ marginTop: 12, alignItems: 'center' }}>
                    <div style={{ flex: 1, height: 6, background: 'var(--line)', borderRadius: 99 }}>
                      <div style={{
                        width: `${e.progress}%`, height: '100%', borderRadius: 99,
                        background: e.progress === 100 ? 'var(--green)' : 'var(--blue-600)',
                      }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 12, color: e.progress === 100 ? 'var(--green)' : 'var(--blue-600)' }}>
                      {e.progress}%
                    </span>
                  </div>
                </div>
                <Link href={`/courses/${e.course_id}`} className="btn btn-soft btn-sm" style={{ flexShrink: 0 }}>
                  {e.progress === 100 ? 'Review' : 'Continue'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
