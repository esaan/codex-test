export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Next.js + Tailwind</h1>
        <p className="text-slate-600 dark:text-slate-300">
          App Router, TypeScript, Tailwind — ready to go.
        </p>
        <div className="space-x-4">
          <a className="text-blue-600 underline" href="/api/hello">
            API Route example
          </a>
          <a className="text-blue-600 underline" href="/jobs">
            Sitecore XM Cloud Jobs
          </a>
        </div>
      </div>
    </main>
  );
}
