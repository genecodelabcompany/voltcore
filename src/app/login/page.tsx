import { SignIn } from '@clerk/nextjs';
import { Logo } from '@/components/logo';
import { Icon } from '@/components/icon';

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
        <div style={{ position: 'relative' }}><Logo size={1.05} dark /></div>
        <div style={{ position: 'relative', maxWidth: 460 }}>
          <h1 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.12, letterSpacing: '-.02em' }}>
            Ghana&apos;s home for electronics &amp; engineering.
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <SignIn
          forceRedirectUrl="/account"
          signUpForceRedirectUrl="/account"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              rootBox: { width: '100%', maxWidth: 400 },
              card: { boxShadow: 'none', padding: 0, border: 'none', background: 'transparent' },
            },
          }}
        />
      </div>
    </div>
  );
}
