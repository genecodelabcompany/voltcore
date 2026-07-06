'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function AuthCallback() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      // Check if user has admin role
      const role = user.publicMetadata?.role as string | undefined;

      // Sync user to backend
      fetch('/api/auth/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          role: role || 'customer',
        }),
      }).catch(() => {});

      // Redirect based on role
      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } else if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(150deg,#f7f8fa,#eef1f5)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--blue-200)',
          borderTopColor: 'var(--blue-600)', animation: 'spin .8s linear infinite',
          margin: '0 auto 20px',
        }} />
        <div style={{ fontWeight: 700, fontSize: 16 }}>Signing you in…</div>
        <div className="sub" style={{ fontSize: 13, marginTop: 4 }}>Redirecting to your account</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
