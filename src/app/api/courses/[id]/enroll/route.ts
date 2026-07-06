import { type NextRequest } from 'next/server';
import { enrollStudent } from '@/lib/repos/courses';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: course_id } = await params;
    const { student_name, student_email, amount, payment_ref } = await request.json();

    if (!student_name || !student_email) {
      return Response.json({ error: 'student_name and student_email are required' }, { status: 400 });
    }

    const enrollmentId = await enrollStudent({ course_id, student_name, student_email, amount: amount ?? 0, payment_ref });
    return Response.json({ id: enrollmentId }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/courses/[id]/enroll]', e);
    return Response.json({ error: 'Failed to enroll student' }, { status: 500 });
  }
}
