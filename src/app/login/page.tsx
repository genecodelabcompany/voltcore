import { SignIn } from '@clerk/nextjs';
import { Logo } from '@/components/logo';
import { Icon } from '@/components/icon';
import Link from 'next/link';

const feats = [
  ['box', '12,000+ Components', 'Arduino, sensors, modules & more'],
  ['cap', 'Engineering Academy', 'Hands-on STEM training & certificates'],
  ['wrench', 'Pro Services', 'PCB, IoT & automation engineering'],
  ['shield', 'Secure Payments', 'Paystack · MTN MoMo · Card'],
] as const;

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.05fr 1fr' }}>
      {/* Brand panel */}
      <div style={{
        background: 'linear-gradient(150deg,var(--navy),#143257)', color: '#fff',
        padding: '56px 64px', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(59,130,246,.28),transparent 70%)',
          top: -120, right: -120,
        }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo size={1.05} dark />
          <Link href="/shop" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: '#93C5FD', fontSize: 14, fontWeight: 600, textDecoration: 'none',
            padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(147,197,253,.3)',
            transition: 'background .2s',
          }}>
            <Icon name="arrowR" size={15} /> Back to Shop
          </Link>
        </div>
        <div style={{ position: 'relative', maxWidth: 460 }}>
          <h1 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.12, letterSpacing: '-.02em' }}>
            Ghana's home for electronics & engineering.
          </h1>
          <p style={{ color: '#9FB6D6', fontSize: 16, marginTop: 16, lineHeight: 1.6 }}>
            Shop quality components, learn from practicing engineers, and book professional services — all in one platform built in Accra.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 36 }}>
            {feats.map(f => (
              <div key={f[0]} className="row gap12">
                <div style={{
                  width: 42, height: 42, borderRadius: 11,
                  background: 'rgba(96,165,250,.16)', color: '#93C5FD',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon name={f[0]} size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{f[1]}</div>
                  <div style={{ color: '#9FB6D6', fontSize: 12.5, marginTop: 2 }}>{f[2]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', color: '#6E89AD', fontSize: 13 }}>
          © 2026 VoltCore Electronics · Accra, Ghana
        </div>
      </div>

      {/* Clerk sign-in panel */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40,
        background: '#fff',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Welcome back</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>Sign in to your VoltCore account</p>
          </div>
          <SignIn
            forceRedirectUrl="/api/auth/callback"
            signUpForceRedirectUrl="/api/auth/callback"
            signUpUrl="/sign-up"
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
        </div>
      </div>
    </div>
  );
}
