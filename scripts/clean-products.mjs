/**
 * Delete extra dummy products that were not seeded by seed-data.mjs
 */
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf8');

const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let value = trimmed.slice(eqIdx + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  env[key] = value;
}

const db = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

const seededIds = [
  'p1','p2','p3','p4','p5','p6','p7','p8','p9','p10',
  'p11','p12','p13','p14','p15','p16','p17','p18','p19','p20',
  'p21','p22','p23','p24'
];

const placeholders = seededIds.map(() => '?').join(',');

async function clean() {
  // First, check what products exist
  const all = await db.execute('SELECT id, name FROM products');
  console.log('Current products in DB:');
  for (const row of all.rows) {
    console.log(`  ${row.id}: ${row.name}`);
  }

  // Delete products not in the seeded list
  const result = await db.execute({
    sql: `DELETE FROM products WHERE id NOT IN (${placeholders})`,
    args: seededIds,
  });
  console.log(`\nDeleted ${result.rowsAffected} extra products`);

  // Verify remaining
  const remaining = await db.execute('SELECT COUNT(*) as cnt FROM products');
  console.log(`Remaining products: ${remaining.rows[0].cnt}`);
}

clean().catch(e => { console.error(e); process.exit(1); });
