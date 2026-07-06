import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { StoreProvider } from '@/context/store-context';

export const metadata: Metadata = {
  title: 'VoltCore Electronics',
  description: "Ghana's home for electronics & engineering.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <ClerkProvider>
          <StoreProvider>
            {children}
          </StoreProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
