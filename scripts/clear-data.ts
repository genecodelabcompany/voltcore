/**
 * Clear all seed data from the database.
 * Keeps tables and settings intact.
 * Usage: npx tsx scripts/clear-data.ts
 */
import { createClient } from '@libsql/client';

if (!process.env.TURSO_DATABASE_URL) throw new Error('TURSO_DATABASE_URL is required');
if (!process.env.TURSO_AUTH_TOKEN) throw new Error('TURSO_AUTH_TOKEN is required');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const TABLES = [
  'order_items',
  'orders',
  'enrollments',
  'courses',
  'service_inquiries',
  'services',
  'products',
  'categories',
  'banners',
  'coupons',
];

async function clearData() {
  console.log('🗑️  Clearing all seed data from database…\n');

  for (const table of TABLES) {
    const result = await db.execute(`DELETE FROM ${table}`);
    console.log(`   ✅ ${table}: cleared`);
  }

  console.log('\n🎉 All seed data cleared!');
  console.log('   Tables, settings, and users are preserved.');
}

clearData().catch(e => { console.error(e); process.exit(1); });
