'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StoreShell } from '@/components/shells/store-shell';
import { StarRow } from '@/components/star-row';
import { Icon } from '@/components/icon';
import { money } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';

interface Course {
  id: string; title: string; level: string; hours: number;
  price: number; enrolled: number; rating: number; instructor: string;
  glyph: string; cert: number; description: string;
}

const EMOJIS = ['🔌', '⚡', '📡', '🤖', '🔧', '💾'];

export default function CourseDetail({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { isSignedIn } = useUser();

  useEffect(() => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(data => {
        const c = (data.courses ?? []).find((x: Course) => x.id === params.id);
        setCourse(c ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handleEnrol = async () => {
    if (!isSignedIn) { router.push('/sign-in'); return; }
    setEnrolling(true);
    setError('');
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: params.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Enrolment failed');
      setEnrolled(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return (
    <StoreShell>
      <div style={{ textAlign: 'center', padding: '80px 20px' }}><div className="sub">Loading course…</div></div>
    </StoreShell>
  );

  if (!course) return (
    <StoreShell>
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Course not found</div>
        <button className="btn btn-primary" onClick={() => router.push('/courses')}>Browse Courses</button>
      </div>
    </StoreShell>
  );

  const curriculum = [
    { title: 'Introduction & Overview', mins: 25, free: true },
    { title: 'Core Concepts & Theory', mins: 45, free: true },
    { title: 'Practical Lab Session 1', mins: 60, free: false },
    { title: 'Practical Lab Session 2', mins: 60, free: false },
    { title: 'Project: Build Your First Circuit', mins: 90, free: false },
    { title: 'Assessment & Certification', mins: 30, free: false },
  ];

  return (
    <StoreShell>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        {/* Breadcrumb */}
        <div className="breadcrumb row gap6 sub" style={{ fontSize: 13, marginBottom: 20 }}>
          <span style={{ cursor: 'pointer', color: 'var(--blue-600)' }} onClick={() => router.push('/courses')}>Courses</span>
          <span>/</span>
          <span>{course.title}</span>
        </div>

        {/* Hero */}
        <div className="course-hero card" style={{
          background: 'linear-gradient(135deg, var(--navy), #1a3560)', color: '#fff',
          padding: '40px 36px', marginBottom: 24, overflow: 'hidden', position: 'relative',
        }}>
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{EMOJIS[Math.floor(Math.random() * EMOJIS.length)]}</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 12px', lineHeight: 1.2 }}>{course.title}</h1>
            <p style={{ fontSize: 15, opacity: .8, maxWidth: 600, lineHeight: 1.6, marginBottom: 20 }}>{course.description}</p>
            <div className="row gap16" style={{ flexWrap: 'wrap', marginBottom: 24 }}>
              <div className="row gap6"><Icon name="user" size={16} color="#93C5FD" /><span style={{ fontSize: 14 }}>{course.instructor}</span></div>
              <div className="row gap6"><Icon name="clock" size={16} color="#93C5FD" /><span style={{ fontSize: 14 }}>{course.hours} hours</span></div>
              <div className="row gap6"><Icon name="users" size={16} color="#93C5FD" /><span style={{ fontSize: 14 }}>{course.enrolled.toLocaleString()} enrolled</span></div>
              <div className="row gap6"><StarRow rating={course.rating} size={14} /><span style={{ fontSize: 14 }}>{course.rating}</span></div>
            </div>
            <div className="row gap12">
              {enrolled ? (
                <button className="btn btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.3)' }}>
                  <Icon name="check" size={16} />Enrolled ✓
                </button>
              ) : (
                <button className="btn btn-primary" onClick={handleEnrol} disabled={enrolling}>
                  {enrolling ? '⏳ Enrolling…' : course.price === 0 ? 'Enrol Free' : `Enrol — ${money(course.price)}`}
                </button>
              )}
              {course.cert ? <span className="pill" style={{ background: 'rgba(255,255,255,.15)', color: '#fff' }}>🎓 Certificate</span> : null}
              <span className={`pill ${course.level === 'Beginner' ? 'pill-green' : course.level === 'Intermediate' ? 'pill-amber' : 'pill-indigo'}`} style={{ background: 'rgba(255,255,255,.15)', color: '#fff' }}>
                {course.level}
              </span>
            </div>
            {error && <div style={{ marginTop: 16, color: '#FCA5A5', fontSize: 14 }}>{error}</div>}
          </div>
        </div>

        <div className="course-content-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
          {/* Main content */}
          <div>
            <div className="card card-pad" style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>About This Course</h3>
              <div style={{ fontSize: 14.5, lineHeight: 1.75, color: 'var(--ink)' }}>
                <p>This comprehensive course is designed for electronics enthusiasts, students, and professionals looking to deepen their practical knowledge. You'll learn through a combination of theory and hands-on projects.</p>
                <p>By the end of this course, you'll be able to design, build, and troubleshoot real electronic circuits with confidence. All materials are sourced locally and tailored for the Ghanaian context.</p>
              </div>
            </div>

            <div className="card card-pad">
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Curriculum</h3>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {curriculum.map((m, i) => (
                  <div key={i} className="row between" style={{
                    padding: '14px 0', borderBottom: i < curriculum.length - 1 ? '1px solid var(--line-2)' : 'none',
                  }}>
                    <div className="row gap12">
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', background: m.free ? 'var(--green-bg)' : 'var(--surface-2)',
                        color: m.free ? 'var(--green)' : 'var(--muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0,
                      }}>{i + 1}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{m.title}</div>
                        <div className="sub" style={{ fontSize: 12 }}>{m.mins} minutes</div>
                      </div>
                    </div>
                    {m.free && <span className="pill pill-green" style={{ fontSize: 11 }}>Free</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="card card-pad" style={{ position: 'sticky', top: 96 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Course Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  ['Level', course.level],
                  ['Duration', `${course.hours} hours`],
                  ['Students', course.enrolled.toLocaleString()],
                  ['Rating', `${course.rating} / 5`],
                  ['Certificate', course.cert ? 'Yes' : 'No'],
                  ['Language', 'English'],
                  ['Access', 'Lifetime'],
                ].map(([k, v]) => (
                  <div key={k} className="row between">
                    <span className="sub" style={{ fontSize: 13.5 }}>{k}</span>
                    <span style={{ fontWeight: 600, fontSize: 13.5 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="divider" style={{ margin: '16px 0' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: course.price === 0 ? 'var(--green)' : 'var(--blue-600)' }}>
                  {course.price === 0 ? 'Free' : money(course.price)}
                </div>
                <div className="sub" style={{ fontSize: 12, marginTop: 4 }}>One-time payment, lifetime access</div>
              </div>
              {!enrolled && (
                <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: 16 }} onClick={handleEnrol} disabled={enrolling}>
                  {enrolling ? '⏳ Enrolling…' : course.price === 0 ? 'Enrol Free' : `Enrol Now — ${money(course.price)}`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
