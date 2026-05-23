import { GameBoard } from "@/components/game/GameBoard";

export default function GamePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Sandbox</h1>
      <GameBoard />
    </section>
  );
}
