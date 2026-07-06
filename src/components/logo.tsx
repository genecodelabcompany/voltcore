import Image from 'next/image';

interface LogoProps {
  size?: number;
  dark?: boolean;
}

export function Logo({ size = 1, dark = false }: LogoProps) {
  const ink = dark ? '#fff' : 'var(--ink)';
  return (
    <div className="row gap8" style={{ alignItems: 'center' }}>
      <div style={{
        width: 38 * size, height: 38 * size, borderRadius: 10 * size, flexShrink: 0,
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Image src="/apple-touch-icon.png" alt="VoltCore" width={38 * size} height={38 * size} style={{ objectFit: 'cover' }} />
      </div>
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 18 * size, letterSpacing: '-.02em', color: ink }}>VOLTCORE</div>
        <div style={{ fontWeight: 600, fontSize: 9.5 * size, letterSpacing: '.34em', color: 'var(--muted)', marginTop: 2 }}>ELECTRONICS</div>
      </div>
    </div>
  );
}
