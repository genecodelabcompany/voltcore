import { type NextRequest } from 'next/server';
import { getCourses, createCourse } from '@/lib/repos/courses';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get('status') ?? undefined;
    const courses = await getCourses(status);
    return Response.json({ courses });
  } catch (e) {
    console.error('[GET /api/courses]', e);
    return Response.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, level, lessons, hours, price, instructor, glyph, cert, description, image_url, status } = body;
    if (!title || !instructor) {
      return Response.json({ error: 'title and instructor are required' }, { status: 400 });
    }
    const id = randomUUID().slice(0, 8);
    await createCourse({ id, title, level, lessons, hours, price, instructor, glyph, cert, description, image_url, status });
    return Response.json({ id }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/courses]', e);
    return Response.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
