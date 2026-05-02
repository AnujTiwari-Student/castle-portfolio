Read root readme.md, WORKFLOW.md, DETAILS.md, and the current codebase.

Now implement Phase 6 only: SRE Lab and Project Terminal.

Hard constraints:

- Frontend code stays inside frontend/.
- Use frontend/src/.
- Do not create root src/.
- Do not implement Go backend yet.
- Do not call the real GitHub API yet.
- Do not touch Prisma yet.

Goal:

Make the SRE Lab project showcase functional using mock data, while designing it to be backend-ready later.

Implement:

1. Holographic project bays
2. Project selection
3. Project terminal UI
4. Project detail modal
5. Mock project metadata
6. Backend-ready API abstraction
7. GitHub stats placeholder UI

SRE Lab requirements:

- each project has a holographic section/bay
- project bays are interactable
- central terminal can browse projects
- terminal displays:
  - project name
  - description
  - tech stack
  - GitHub repo URL
  - mock stars/forks
  - mock status
  - mock code snippet
- terminal should feel high-tech but remain simple

Mock data:

Use frontend/src/data/projects.mock.ts.

API abstraction:

Create frontend helper functions that currently return mock data, but are shaped like future backend calls.

Example future endpoints:

GET /api/projects
GET /api/projects/:id
GET /api/github/repo-stats?owner=&repo=

Add/update files:

frontend/src/components/zones/sre-lab/
  SRELab.tsx
  ProjectBay.tsx
  ProjectTerminal.tsx
  ProjectDetailsPanel.tsx

frontend/src/components/ui/
  TerminalModal.tsx
  CodeSnippetPanel.tsx

frontend/src/data/
  projects.mock.ts

frontend/src/lib/
  api.ts

Rules:

- Use mock data only.
- Do not call GitHub API yet.
- Do not hardcode project content inside components.
- Keep UI outside Canvas where possible.
- Make project bays identifiable in 3D.
- Make the system easy to connect to Go backend later.
- Make sure the app compiles.

After implementation:

- list all created/modified files
- explain how SRE Lab works
- explain how mock API abstraction works
- update root WORKFLOW.md with Phase 6 completion notes

Stop after Phase 6.
Do not continue to Phase 7.