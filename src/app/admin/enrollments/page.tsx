import { PageHead } from '@/components/page-head';
import { MiniStat } from '@/components/mini-stat';
import { Icon } from '@/components/icon';

const NAMES = [
  'Kwame Mensah', 'Akosua Boateng', 'Yaw Asante', 'Esi Nyarko', 'Nana Osei',
  'Adwoa Sarpong', 'Kofi Annan', 'Ama Serwaa', 'Kojo Addae', 'Abena Ofori',
];

const COURSES = [
  { title: 'Embedded Systems with Arduino' },
  { title: 'PCB Design Masterclass' },
  { title: 'IoT & Wireless Communications' },
  { title: 'Power Electronics Fundamentals' },
  { title: 'Robotics & Automation' },
  { title: 'Digital Signal Processing' },
];

const enrollments = NAMES.flatMap((name, ni) =>
  COURSES.slice(0, 2 + (ni % 3)).map((c, ci) => {
    const pct = 20 + ((ni * 17 + ci * 31) % 80);
    return {
      student: name,
      course: c.title,
      enrolled: `${(ni % 12) + 1} May 2025`,
      progress: pct,
      completed: pct === 100,
      certificate: pct === 100 && ni % 2 === 0,
    };
  })
).slice(0, 18);

export default function AdminEnrollments() {
  return (
    <div>
      <PageHead title="Enrollments" sub="Track learner progress across all courses"
        actions={<button className="btn btn-ghost"><Icon name="download" size={16} />Export</button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <MiniStat label="Total Enrollments" value="428" />
        <MiniStat label="In Progress" value="312" c="var(--c-blue)" />
        <MiniStat label="Completed" value="116" c="var(--c-green)" />
        <MiniStat label="Certificates Issued" value="89" c="var(--c-purple)" />
      </div>
      <div className="card card-pad">
        <table className="tbl tbl-hover">
          <thead><tr><th>Student</th><th>Course</th><th>Enrolled</th><th>Progress</th><th>Status</th><th>Certificate</th></tr></thead>
          <tbody>
            {enrollments.map((e, i) => (
              <tr key={i}>
                <td>
                  <div className="row gap10">
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', background: 'var(--blue-100)', color: 'var(--blue-700)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0,
                    }}>
                      {e.student.split(' ').map(x => x[0]).join('')}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 13.5 }}>{e.student}</span>
                  </div>
                </td>
                <td style={{ fontSize: 13, maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.course}</td>
                <td className="sub" style={{ fontSize: 13 }}>{e.enrolled}</td>
                <td style={{ width: 160 }}>
                  <div className="row gap8" style={{ alignItems: 'center' }}>
                    <div style={{ flex: 1, height: 6, background: 'var(--line)', borderRadius: 99 }}>
                      <div style={{
                        width: e.progress + '%', height: '100%', borderRadius: 99,
                        background: e.progress === 100 ? 'var(--c-green)' : 'var(--c-blue)',
                      }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', width: 30 }}>{e.progress}%</span>
                  </div>
                </td>
                <td>
                  {e.completed
                    ? <span className="pill pill-green"><span className="dot" />Completed</span>
                    : <span className="pill pill-proc"><span className="dot" />In Progress</span>}
                </td>
                <td>
                  {e.certificate
                    ? <button className="btn btn-ghost btn-sm"><Icon name="download" size={14} />Download</button>
                    : <span className="sub" style={{ fontSize: 12 }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
