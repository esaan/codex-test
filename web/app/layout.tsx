import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import paths from '@/paths';

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
            <Link href={paths.HomePage()} className="text-lg font-semibold tracking-tight">Fictional HealthCare</Link>
            <div className="space-x-4 text-sm">
              <Link
                href={paths.AboutPage()}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                About
              </Link>             
              <Link
                href={paths.DoctorsPage()}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Find A Provider
              </Link>
              <Link
                href={paths.NewsPage()}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                News & Articles
              </Link>
              <Link
                href={paths.EmailMarketingPage()}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Email Marketing
              </Link>
              <Link
                href={paths.ContactPage()}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Contact
              </Link>
              <Link
                href={paths.ServicesPage()}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Services
              </Link>
              <Link
                href={paths.LocationsPage()}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Locations
              </Link>
              <Link
                href={paths.EventsPage()}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Events
              </Link>
              <Link
                href={paths.BlogsPage()}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Blogs
              </Link>
              <Link
                href={paths.JobsPage()}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Careers
              </Link>             
              {/* <Link
                href={paths.ApiHelloRoute()}
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
