/**
 * One-time script: stamps publicMetadata.role = 'admin' on the VoltCore admin user.
 * Usage: node scripts/set-admin.mjs
 */

const SECRET = process.env.CLERK_SECRET_KEY || 'sk_test_tbbjnIuxtL1wgIqicAqJqgl7dK8OVsLw843BRtAhv3';
const ADMIN_EMAIL = 'engineeringvoltcore@gmail.com';

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
  console.log(`Looking up user: ${ADMIN_EMAIL}`);
  const users = await clerkFetch(`/users?email_address=${encodeURIComponent(ADMIN_EMAIL)}`);

  if (!users.length) {
    console.error('No user found with that email. Make sure the account exists in Clerk.');
    process.exit(1);
  }

  const user = users[0];
  console.log(`Found user: ${user.id} (${user.first_name} ${user.last_name})`);

  await clerkFetch(`/users/${user.id}/metadata`, {
    method: 'PATCH',
    body: JSON.stringify({ public_metadata: { role: 'admin' } }),
  });

  console.log('✅  publicMetadata.role = "admin" set successfully.');
  console.log('    The admin can now sign in at /sign-in and access /admin.');
}

main().catch(e => { console.error(e.message); process.exit(1); });
