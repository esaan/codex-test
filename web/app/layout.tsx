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
      <body>
        <header className="border-b bg-white/70 backdrop-blur dark:bg-slate-900/50">
          <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <a href="/" className="text-lg font-semibold tracking-tight">Codex Test</a>
            <div className="space-x-4 text-sm">
              <a
                href="/"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Home
              </a>
              <a
                href="/jobs"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Jobs
              </a>
              <a
                href="/about"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                About
              </a>
              <a
                href="/api/hello"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                API
              </a>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
