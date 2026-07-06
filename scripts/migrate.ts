/**
 * VoltCore DB Migration Script
 * Usage: npx tsx scripts/migrate.ts
 *
 * Creates tables and default settings only.
 * No seed data — admin adds products, courses, and services via the dashboard.
 */
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join } from 'path';

if (!process.env.TURSO_DATABASE_URL) throw new Error('TURSO_DATABASE_URL is required');
if (!process.env.TURSO_AUTH_TOKEN) throw new Error('TURSO_AUTH_TOKEN is required');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const DEFAULT_SETTINGS = [
  { key: 'store_name',             value: 'VoltCore Electronics' },
  { key: 'store_email',            value: 'engineeringvoltcore@gmail.com' },
  { key: 'support_phone',          value: '0559411222' },
  { key: 'address',                value: 'Electronics Hub, Circle, Accra, Ghana' },
  { key: 'currency',               value: 'GHS' },
  { key: 'timezone',               value: 'Africa/Accra' },
  { key: 'free_shipping_threshold',value: '500' },
  { key: 'standard_shipping_fee',  value: '25' },
  { key: 'express_shipping_fee',   value: '75' },
];

async function migrate() {
  console.log('📦 Reading schema.sql…');
  const schema = readFileSync(join(process.cwd(), 'src/lib/schema.sql'), 'utf8');

  console.log('🗄️  Creating tables…');
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    await db.execute(stmt + ';');
  }
  console.log('✅ Tables created');

  // ── Default Settings ──────────────────────────────────────────────────────
  console.log('\n⚙️  Seeding settings…');
  for (const s of DEFAULT_SETTINGS) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`,
      args: [s.key, s.value],
    });
  }
  console.log(`   ${DEFAULT_SETTINGS.length} settings seeded`);

  console.log('\n🎉 Migration complete!');
  console.log('   No seed data added — admin can add products, courses, and services via the dashboard.');
}

migrate().catch(e => { console.error(e); process.exit(1); });
