import { db } from '@/lib/db';
import { type NextRequest } from 'next/server';

export async function GET() {
  try {
    const result = await db.execute(`SELECT key, value FROM settings`);
    const settings: Record<string, string> = {};
    for (const row of result.rows as unknown as { key: string; value: string }[]) {
      settings[row.key] = row.value;
    }
    return Response.json({ settings });
  } catch (e) {
    console.error('[GET /api/settings]', e);
    return Response.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { settings } = await request.json() as { settings: Record<string, string> };
    for (const [key, value] of Object.entries(settings)) {
      await db.execute({
        sql: `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
              ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
        args: [key, value],
      });
    }
    return Response.json({ success: true });
  } catch (e) {
    console.error('[POST /api/settings]', e);
    return Response.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
