"use client";
import { useGameStore } from "@/lib/store";

export function HUD() {
  const room = useGameStore((s) => s.currentRoom);
  const nearby = useGameStore((s) => s.nearbyProject);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-6 text-white">
      <header className="flex items-center justify-between">
        <div className="rounded-lg bg-black/40 backdrop-blur px-4 py-2 border border-cyan-400/30">
          <p className="text-xs uppercase tracking-widest text-cyan-300">Location</p>
          <p className="text-lg font-semibold">{room.toUpperCase()}</p>
        </div>
        <div className="rounded-lg bg-black/40 backdrop-blur px-4 py-2 border border-cyan-400/30 text-sm">
          <p>WASD / Arrows — move · Space — jump · E — interact</p>
        </div>
      </header>
      {nearby && (
        <div className="self-center rounded-lg bg-yellow-400/90 text-black px-4 py-2 font-bold">
          [E] Inspect: {nearby}
        </div>
      )}
    </div>
  );
}
