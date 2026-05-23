import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">Titrate the Vinegar</h1>
        <p className="max-w-xl text-slate-600 dark:text-slate-400">
          Standardize NaOH, titrate a vinegar sample, find its percent acetic acid.
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
        </Link>

        <Link
          href="/game"
          className="block rounded-xl border border-slate-300 p-5 transition hover:border-slate-500 dark:border-slate-700"
        >
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sandbox
          </div>
          <div className="mt-1 text-lg font-bold">Free play</div>
        </Link>
      </div>
    </section>
  );
}
