import { createClient } from '@libsql/client';

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL environment variable is not set');
}
if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error('TURSO_AUTH_TOKEN environment variable is not set');
}

// Singleton pattern — reuse the same client across hot-reloads in dev
const globalForDb = globalThis as unknown as { _tursoClient?: ReturnType<typeof createClient> };

export const db =
  globalForDb._tursoClient ??
  createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb._tursoClient = db;
}
