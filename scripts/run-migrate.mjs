/**
 * Helper to run migration with env vars loaded.
 * Usage: node scripts/run-migrate.mjs
 */
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf8');

// Parse .env.local
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let value = trimmed.slice(eqIdx + 1).trim();
  // Remove surrounding quotes if any
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  env[key] = value;
}

// Set env vars and run migration
const envString = Object.entries(env)
  .map(([k, v]) => `${k}=${v}`)
  .join(' ');

console.log('Running migration...');
execSync(`npx tsx scripts/migrate.ts`, {
  cwd: join(__dirname, '..'),
  env: { ...process.env, ...env },
  stdio: 'inherit',
});
