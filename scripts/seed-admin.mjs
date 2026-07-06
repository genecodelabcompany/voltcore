/**
 * Seed script: Creates the admin user in Clerk (if not exists) and stamps admin role.
 * Run once before deploying, or whenever you need to ensure the admin exists.
 *
 * Usage: node scripts/seed-admin.mjs
 *
 * The admin can then sign in at /login with their email + password.
 */

const SECRET = process.env.CLERK_SECRET_KEY;
const ADMIN_EMAIL = 'engineeringvoltcore@gmail.com';
const ADMIN_PASSWORD = 'Admin@123456'; // <-- CHANGE THIS after first login

async function clerkFetch(path, options = {}) {
  const res = await fetch(`https://api.clerk.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${SECRET}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Clerk API error ${res.status}: ${JSON.stringify(body)}`);
  return body;
}

async function main() {
  if (!SECRET) {
    console.error('❌  CLERK_SECRET_KEY is not set. Run with: node scripts/seed-admin.mjs');
    process.exit(1);
  }

  console.log(`🔍  Looking up user: ${ADMIN_EMAIL}`);
  const users = await clerkFetch(`/users?email_address=${encodeURIComponent(ADMIN_EMAIL)}`);

  let user;

  if (users.length > 0) {
    user = users[0];
    console.log(`✅  Found existing user: ${user.id} (${user.first_name || ''} ${user.last_name || ''})`);
  } else {
    console.log(`👤  User not found. Creating admin user in Clerk...`);
    user = await clerkFetch('/users', {
      method: 'POST',
      body: JSON.stringify({
        email_address: [ADMIN_EMAIL],
        password: ADMIN_PASSWORD,
        first_name: 'VoltCore',
        last_name: 'Admin',
        public_metadata: { role: 'admin' },
      }),
    });
    console.log(`✅  Created user: ${user.id}`);
  }

  // Ensure admin role is set
  const currentRole = user.public_metadata?.role;
  if (currentRole !== 'admin') {
    console.log(`🏷️  Stamping admin role...`);
    await clerkFetch(`/users/${user.id}/metadata`, {
      method: 'PATCH',
      body: JSON.stringify({ public_metadata: { role: 'admin' } }),
    });
    console.log(`✅  Admin role set.`);
  } else {
    console.log(`✅  Already has admin role.`);
  }

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Admin account ready!');
  console.log('  Email:    ' + ADMIN_EMAIL);
  console.log('  Password: ' + ADMIN_PASSWORD);
  console.log('  Sign in:  /login');
  console.log('  Admin:    /admin');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('⚠️  IMPORTANT: Change the password after first login!');
}

main().catch(e => { console.error(e.message); process.exit(1); });
