import { TRO_REFERENCES } from "@/lib/content/tro-references";

export default function TheoryPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Theory</h1>
      <p className="max-w-2xl text-slate-700 dark:text-slate-300">
        Each card below points to the section of Tro's General Chemistry where the concept is
        developed in full. The simulation implements these exact relationships in
        <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800">
          src/lib/chemistry
        </code>
        .
      </p>
      <ul className="grid gap-4 md:grid-cols-2">
        {Object.values(TRO_REFERENCES).map((ref) => (
          <li
            key={ref.id}
            className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-semibold">{ref.title}</h2>
              <span className="text-xs text-slate-500">{ref.section}</span>
            </div>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{ref.chapter}</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{ref.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
