import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">Titrate the Vinegar</h1>
        <p className="max-w-2xl text-slate-700 dark:text-slate-300">
          Standardize NaOH against KHP, titrate a vinegar sample to find its percent acetic
          acid by mass, and confront the lab pitfalls — CO₂ pickup, indicator error, and the
          gap between "first pink" and the real equivalence point.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/lab"
          className="block rounded-xl border border-slate-300 bg-slate-50 p-5 transition hover:border-slate-500 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">
            Guided lab
          </div>
          <div className="mt-1 text-lg font-bold">Predict → standardize → titrate → report</div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            The full lab experience with realistic failure modes built in. Recommended for
            first-time learners.
          </p>
        </Link>

        <Link
          href="/game"
          className="block rounded-xl border border-slate-300 p-5 transition hover:border-slate-500 dark:border-slate-700"
        >
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sandbox
          </div>
          <div className="mt-1 text-lg font-bold">Open simulation</div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Free-play with the vinegar titration. Same engine, no scaffolding.
          </p>
        </Link>
      </div>

      <div>
        <Link
          href="/theory"
          className="text-sm text-slate-600 underline hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          Read the theory →
        </Link>
      </div>
    </section>
  );
}
