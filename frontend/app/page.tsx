"use client";
import dynamic from "next/dynamic";
import { HUD } from "@/components/ui/HUD";
import { ProjectOverlay } from "@/components/ui/ProjectOverlay";

// Avoid SSR for R3F canvas
const Scene = dynamic(() => import("@/components/canvas/Scene").then(m => m.Scene), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black text-cyan-300">
      Loading castle...
    </div>
  ),
});

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <Scene />
      <HUD />
      <ProjectOverlay />
    </main>
  );
}
