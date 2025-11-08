import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about the Codex Test project and its purpose.',
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">About Us</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          This project showcases a simple Next.js app with a jobs explorer,
          built with TypeScript and Tailwind CSS.
        </p>
      </header>

      <section className="prose dark:prose-invert max-w-none">
        <p>
          Our goal is to provide a clean, modern starter that demonstrates
          the App Router, API routes, and a small feature area (jobs) with
          client-side interactions.
        </p>
        <p>
          The jobs data is stored locally for simplicity, and the UI focuses
          on usability: filtering, paging, and basic CRUD examples.
        </p>
        <p>
          Have ideas or feedback? We’d love to hear them.
        </p>
      </section>
    </main>
  );
}

