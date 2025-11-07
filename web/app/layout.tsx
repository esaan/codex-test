import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Codex Test',
  description: 'Next.js app scaffolded by Codex',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

