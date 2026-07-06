import { SignUp } from '@clerk/nextjs';
import { Logo } from '@/components/logo';
import { Icon } from '@/components/icon';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(150deg,#f7f8fa,#eef1f5)',
      padding: 20,
    }}>
      <div style={{
        width: '100%', maxWidth: 480,
        background: '#fff', borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,.06)',
        padding: '40px 36px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link href="/shop" style={{ display: 'inline-block', marginBottom: 20 }}>
            <Logo size={0.9} />
          </Link>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Create Account</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>Join VoltCore Electronics today</p>
        </div>
        <SignUp
          forceRedirectUrl="/api/auth/callback"
          signInForceRedirectUrl="/api/auth/callback"
          signInUrl="/sign-in"
          appearance={{
            elements: {
              rootBox: { width: '100%' },
              card: { boxShadow: 'none', padding: 0, border: 'none', background: 'transparent' },
              headerTitle: { display: 'none' },
              headerSubtitle: { display: 'none' },
              socialButtonsBlockButton: {
                borderRadius: 8, border: '1px solid #e2e8f0',
                fontSize: 14, fontWeight: 600, height: 44,
              },
              formButtonPrimary: {
                background: 'var(--blue-600)', borderRadius: 8,
                fontSize: 14, fontWeight: 600, height: 44,
              },
              formFieldInput: {
                borderRadius: 8, border: '1px solid #e2e8f0',
                fontSize: 14, height: 44,
              },
              footerActionLink: { color: 'var(--blue-600)', fontWeight: 600 },
              dividerLine: { background: '#e2e8f0' },
              dividerText: { color: '#94a3b8' },
            },
          }}
        />
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/shop" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'var(--muted)', fontSize: 13, fontWeight: 600, textDecoration: 'none',
          }}>
            <Icon name="arrowR" size={14} /> Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
