import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
          <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">Fictional HealthCare</Link>
            <div className="space-x-4 text-sm">
              <Link
                href="/about"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                About
              </Link>             
              <Link
                href="/doctors"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Find A Provider
              </Link>
              <Link
                href="/news"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                News & Articles
              </Link>
              <Link
                href="/email-marketing"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Email Marketing
              </Link>
              <Link
                href="/contact"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Contact
              </Link>
              <Link
                href="/services"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Services
              </Link>
              <Link
                href="/locations"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Locations
              </Link>
              <Link
                href="/events"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Events
              </Link>
              <Link
                href="/blogs"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Blogs
              </Link>
              <Link
                href="/jobs"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Careers
              </Link>             
              {/* <Link
                href="/api/hello"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                API
              </Link> */}
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
