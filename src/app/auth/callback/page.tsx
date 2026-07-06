'use client';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Auth callback page — redirects users based on their role after sign-in/sign-up.
 * Clerk redirects here after authentication (via forceRedirectUrl).
 */
export default function AuthCallbackPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    const role = user.publicMetadata?.role;

    if (role === 'admin') {
      router.replace('/admin');
    } else {
      router.replace('/account');
    }
  }, [user, isLoaded, router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f8fa',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid var(--blue-600)',
          borderTopColor: 'transparent',
          animation: 'spin .8s linear infinite',
          margin: '0 auto 16px',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <div style={{ fontWeight: 600, color: 'var(--muted)' }}>Redirecting…</div>
      </div>
    </div>
  );
}
