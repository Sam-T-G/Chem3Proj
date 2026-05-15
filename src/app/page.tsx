import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Titrate the Vinegar</h1>
      <p className="max-w-2xl text-slate-700 dark:text-slate-300">
        Standardize NaOH against a vinegar sample and find its percent acetic acid by mass.
        The simulation models the four-region pH curve from Tro §17.4 in real time.
      </p>
      <div className="flex gap-3">
        <Link
          href="/game"
          className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
        >
          Start the lab
        </Link>
        <Link
          href="/theory"
          className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Read the theory
        </Link>
      </div>
    </section>
  );
}
