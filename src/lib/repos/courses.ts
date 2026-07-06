import { db } from '@/lib/db';

export interface CourseRow {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: number;
  hours: number;
  price: number;
  enrolled: number;
  rating: number;
  instructor: string;
  glyph: string;
  image_url: string | null;
  cert: number;
  description: string;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface EnrollmentRow {
  id: string;
  course_id: string;
  student_name: string;
  student_email: string;
  amount: number;
  payment_ref: string | null;
  progress: number;
  enrolled_at: string;
  course_title?: string;
}

export async function getCourses(status?: string): Promise<CourseRow[]> {
  const result = await db.execute({
    sql: `SELECT * FROM courses ${status ? 'WHERE status = ?' : ''} ORDER BY created_at DESC`,
    args: status ? [status] : [],
  });
  return result.rows as unknown as CourseRow[];
}

export async function getCourseById(id: string): Promise<CourseRow | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM courses WHERE id = ?',
    args: [id],
  });
  return (result.rows[0] as unknown as CourseRow) ?? null;
}

export async function createCourse(data: {
  id: string;
  title: string;
  level: string;
  lessons: number;
  hours: number;
  price: number;
  instructor: string;
  glyph: string;
  cert: boolean;
  description: string;
  image_url?: string | null;
  status?: string;
}): Promise<void> {
  await db.execute({
    sql: `INSERT INTO courses
          (id, title, level, lessons, hours, price, instructor, glyph, cert, description, image_url, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      data.id, data.title, data.level, data.lessons, data.hours,
      data.price, data.instructor, data.glyph, data.cert ? 1 : 0,
      data.description, data.image_url ?? null, data.status ?? 'published',
    ],
  });
}

export async function enrollStudent(data: {
  course_id: string;
  student_name: string;
  student_email: string;
  amount: number;
  payment_ref?: string;
}): Promise<string> {
  const { randomUUID } = await import('crypto');
  const id = randomUUID();

  await db.execute({
    sql: `INSERT INTO enrollments (id, course_id, student_name, student_email, amount, payment_ref)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [id, data.course_id, data.student_name, data.student_email, data.amount, data.payment_ref ?? null],
  });

  await db.execute({
    sql: `UPDATE courses SET enrolled = enrolled + 1 WHERE id = ?`,
    args: [data.course_id],
  });

  return id;
}

export async function getEnrollments(courseId?: string): Promise<EnrollmentRow[]> {
  const result = await db.execute({
    sql: `SELECT e.*, c.title as course_title
          FROM enrollments e
          LEFT JOIN courses c ON c.id = e.course_id
          ${courseId ? 'WHERE e.course_id = ?' : ''}
          ORDER BY e.enrolled_at DESC`,
    args: courseId ? [courseId] : [],
  });
  return result.rows as unknown as EnrollmentRow[];
}

export async function getCourseStats(): Promise<{
  total: number; published: number; total_enrolled: number; total_revenue: number;
}> {
  const result = await db.execute(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
      COALESCE(SUM(enrolled), 0) as total_enrolled,
      COALESCE((SELECT SUM(amount) FROM enrollments), 0) as total_revenue
    FROM courses
  `);
  const row = result.rows[0] as unknown as Record<string, number>;
  return {
    total: row.total ?? 0, published: row.published ?? 0,
    total_enrolled: row.total_enrolled ?? 0, total_revenue: row.total_revenue ?? 0,
  };
}
