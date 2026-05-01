"use client";
import { useEffect, useState } from "react";
import { useGameStore } from "@/lib/store";
import { fetchProject } from "@/lib/api";

interface Project {
  slug: string; title: string; description: string;
  techStack: string[]; githubUrl?: string; liveUrl?: string;
}

export function ProjectOverlay() {
  const opened = useGameStore((s) => s.openedProject);
  const close = useGameStore((s) => s.openProject);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!opened) { setProject(null); return; }
    setLoading(true);
    fetchProject(opened)
      .then((p) => setProject(p))
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [opened]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.code === "Escape") close(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  if (!opened) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="max-w-2xl w-full mx-4 rounded-2xl border border-cyan-400/40 bg-gradient-to-b from-slate-900 to-slate-950 p-8 shadow-2xl">
        {loading && <p className="text-white">Loading...</p>}
        {project && (
          <>
            <h2 className="text-3xl font-bold text-cyan-300">{project.title}</h2>
            <p className="mt-4 text-slate-200">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((t) => (
                <span key={t} className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-200 text-xs">{t}</span>
              ))}
            </div>
            <div className="mt-6 flex gap-4">
              {project.githubUrl && <a className="text-cyan-300 underline" href={project.githubUrl} target="_blank">GitHub</a>}
              {project.liveUrl && <a className="text-cyan-300 underline" href={project.liveUrl} target="_blank">Live Demo</a>}
            </div>
          </>
        )}
        <button
          onClick={() => close(null)}
          className="mt-6 px-4 py-2 bg-cyan-500 text-black rounded hover:bg-cyan-400 font-semibold"
        >
          Close (Esc)
        </button>
      </div>
    </div>
  );
}
