import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--surface-1, #f7f8fa)',
    }}>
      <SignIn forceRedirectUrl="/account" signUpForceRedirectUrl="/account" />
    </div>
  );
}
