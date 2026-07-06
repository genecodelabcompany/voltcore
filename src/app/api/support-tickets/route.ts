import { type NextRequest } from 'next/server';
import { db } from '@/lib/db';

function uid() {
  return 'st_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export async function GET() {
  try {
    const result = await db.execute(
      'SELECT * FROM support_tickets ORDER BY created_at DESC'
    );
    return Response.json({ tickets: result.rows });
  } catch (e) {
    console.error('[GET /api/support-tickets]', e);
    return Response.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { subject, category, message, customer_name, customer_email } = await request.json();
    if (!subject) return Response.json({ error: 'subject is required' }, { status: 400 });

    const id = uid();
    await db.execute({
      sql: `INSERT INTO support_tickets (id, subject, category, message, customer_name, customer_email, status)
            VALUES (?, ?, ?, ?, ?, ?, 'open')`,
      args: [id, subject, category || 'Other', message || '', customer_name || '', customer_email || ''],
    });

    return Response.json({ id }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/support-tickets]', e);
    return Response.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}
