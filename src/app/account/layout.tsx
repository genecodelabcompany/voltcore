import { CustomerShell } from '@/components/shells/customer-shell';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <CustomerShell>{children}</CustomerShell>;
}
