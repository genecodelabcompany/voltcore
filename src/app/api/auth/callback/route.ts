import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function GET() {
  const user = await currentUser();

  if (!user) {
    redirect('/login');
  }

  const role = user.publicMetadata?.role;

  if (role === 'admin') {
    redirect('/admin');
  }

  // Regular customer — send to account dashboard
  redirect('/account');
}
