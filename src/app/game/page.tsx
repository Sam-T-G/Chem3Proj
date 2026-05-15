import { GameBoard } from "@/components/game/GameBoard";

export default function GamePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Vinegar Titration</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Add NaOH drop by drop. Stop when the indicator just turns and stays pink.
      </p>
      <GameBoard />
    </section>
  );
}
