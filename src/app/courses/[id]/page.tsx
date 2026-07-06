'use client';
import { useState, useEffect } from 'react';
import { StoreShell } from '@/components/shells/store-shell';
import { StarRow } from '@/components/star-row';
import { Icon } from '@/components/icon';
import { money } from '@/lib/utils';

interface Course {
  id: string; title: string; level: string; hours: number; duration?: string;
  price: number; enrolled: number; students: number; rating: number; instructor: string;
  glyph: string; cert: number; status: string; description: string;
}

const MODULES: Record<string, { title: string; lessons: string[] }[]> = {
  default: [
    { title: 'Module 1: Getting Started', lessons: ['Introduction & Setup', 'Safety Basics', 'Your First Circuit'] },
    { title: 'Module 2: Core Concepts', lessons: ['Digital vs Analog Signals', 'PWM & Motor Control', 'Serial Communication'] },
    { title: 'Module 3: Sensors & Actuators', lessons: ['Temperature Sensors', 'Ultrasonic Distance', 'Servo Motors'] },
    { title: 'Module 4: Real Projects', lessons: ['Weather Station Build', 'Home Automation Intro', 'Final Project'] },
  ],
};

export default function CoursePlayer({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);

  useEffect(() => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(data => {
        const found = (data.courses ?? []).find((c: Course) => c.id === params.id);
        setCourse(found || (data.courses ?? [])[0] || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <StoreShell>
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div className="sub">Loading course…</div>
      </div>
    </StoreShell>
  );

  if (!course) return (
    <StoreShell>
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Course not found</div>
      </div>
    </StoreShell>
  );

  const modules = MODULES[course.id] || MODULES.default;
  const currentLesson = modules[activeModule]?.lessons[activeLesson] || 'Introduction';

  return (
    <StoreShell>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, var(--navy), #1a3a6e)',
          borderRadius: 'var(--r-lg)', padding: '32px 32px', color: '#fff', marginBottom: 24,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: .6, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>VoltCore Training Academy</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 10px' }}>{course.title}</h1>
          <div className="row gap12" style={{ flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, opacity: .8 }}>by {course.instructor}</span>
            <StarRow rating={course.rating} size={14} />
            <span style={{ fontSize: 13, opacity: .7 }}>· {course.students.toLocaleString()} students</span>
            <span style={{ fontSize: 13, opacity: .7 }}>· {course.duration || `${course.hours} hrs`}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'flex-start' }}>
          {/* Video player */}
          <div>
            <div style={{
              background: 'var(--navy)', borderRadius: 'var(--r-lg)', aspectRatio: '16/9',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
            }}>
              <div style={{ textAlign: 'center', color: '#fff' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', cursor: 'pointer',
                }}>
                  <Icon name="play" size={30} color="#fff" />
                </div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{currentLesson}</div>
                <div style={{ opacity: .6, fontSize: 13, marginTop: 6 }}>Click to play</div>
              </div>
            </div>
            <div className="card card-pad">
              <h3 style={{ margin: '0 0 10px', fontSize: 16 }}>{currentLesson}</h3>
              <div className="sub" style={{ fontSize: 14, lineHeight: 1.65 }}>
                In this lesson, you will learn the fundamental principles behind {currentLesson.toLowerCase()}.
                Practical demonstrations using real components will guide you through each concept.
                By the end, you will be able to apply these skills to your own projects.
              </div>
              <div className="row gap10" style={{ marginTop: 16 }}>
                <button className="btn btn-ghost btn-sm"><Icon name="download" size={14} />Resources</button>
                <button className="btn btn-ghost btn-sm"><Icon name="chat" size={14} />Q&A</button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--line)', fontWeight: 700, fontSize: 14 }}>
              Course Content
            </div>
            <div style={{ maxHeight: 520, overflowY: 'auto' }}>
              {modules.map((mod, mi) => (
                <div key={mi}>
                  <button onClick={() => setActiveModule(mi)} style={{
                    width: '100%', padding: '12px 16px', border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: activeModule === mi ? 'var(--blue-50)' : 'transparent',
                    fontWeight: 700, fontSize: 13, color: activeModule === mi ? 'var(--blue-600)' : 'var(--ink)',
                    borderBottom: '1px solid var(--line-2)',
                  }}>{mod.title}</button>
                  {activeModule === mi && mod.lessons.map((lesson, li) => (
                    <button key={li} onClick={() => setActiveLesson(li)} style={{
                      width: '100%', padding: '10px 28px', border: 'none', cursor: 'pointer', textAlign: 'left',
                      background: activeLesson === li ? 'var(--blue-50)' : 'transparent',
                      fontSize: 13, color: activeLesson === li ? 'var(--blue-600)' : 'var(--ink-2)',
                      fontWeight: activeLesson === li ? 600 : 400,
                      borderBottom: '1px solid var(--line-2)',
                    }}>
                      <div className="row gap8">
                        <Icon name={activeLesson === li ? 'play' : 'circle'} size={13} color={activeLesson === li ? 'var(--blue-600)' : 'var(--muted)'} />
                        {lesson}
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ padding: '14px 16px', borderTop: '1px solid var(--line)' }}>
              <div className="sub" style={{ fontSize: 12, marginBottom: 8 }}>Your Progress</div>
              <div style={{ height: 6, background: 'var(--line)', borderRadius: 99, marginBottom: 6 }}>
                <div style={{ width: '35%', height: '100%', borderRadius: 99, background: 'var(--c-blue)' }} />
              </div>
              <div className="sub" style={{ fontSize: 12 }}>35% complete</div>
            </div>
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
