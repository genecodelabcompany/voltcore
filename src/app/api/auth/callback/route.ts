import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  }

  const role = user.publicMetadata?.role;

  if (role === 'admin') {
    return NextResponse.redirect(new URL('/admin', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  }

  // Regular customer — send to account dashboard
  return NextResponse.redirect(new URL('/account', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
}
