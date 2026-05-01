export async function fetchProject(slug: string) {
  const res = await fetch(`/api/backend/projects/${slug}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Not found");
  return res.json();
}

export async function fetchSkills() {
  const res = await fetch(`/api/backend/skills`);
  return res.json();
}

export async function trackVisit(payload: {
  sessionId: string; roomVisited: string; projectSlug?: string; durationMs: number;
}) {
  await fetch(`/api/backend/analytics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
