/**
 * Add region column to orders table if it doesn't exist.
 * Run: node scripts/add-region-column.mjs
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

async function main() {
  // Check if region column exists
  const info = await db.execute('PRAGMA table_info(orders)');
  const hasRegion = info.rows.some(r => r.name === 'region');
  
  if (hasRegion) {
    console.log('region column already exists');
  } else {
    await db.execute("ALTER TABLE orders ADD COLUMN region TEXT NOT NULL DEFAULT ''");
    console.log('region column added successfully');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
