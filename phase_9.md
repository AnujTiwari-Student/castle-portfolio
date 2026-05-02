Read root readme.md, WORKFLOW.md, DETAILS.md, and the current codebase.

Now implement Phase 8 only: Connect Frontend to Go Backend.

Hard constraints:

- Do not touch Prisma yet.
- Do not implement database yet.
- Do not redesign the UI.
- Do not rewrite working systems unnecessarily.
- Keep frontend inside frontend/.
- Keep backend inside backend/.

Goal:

Replace selected frontend mock data calls with backend API calls while keeping graceful fallbacks.

Connect:

1. resume preview/download
2. projects
3. experience timeline
4. social links
5. current job data
6. AI tools data
7. music tracks

Frontend requirements:

- update frontend/src/lib/api.ts with typed fetch helpers
- add API base URL config
- use environment variable:
  NEXT_PUBLIC_API_BASE_URL
- fallback to mock data if backend is unavailable
- show loading states
- show error states
- do not crash the 3D scene if API fails

Connect these areas:

Experience Zone:

- fetch timeline from GET /api/experience
- fallback to experience.mock.ts

Resume Room:

- preview/download from backend endpoints:
  GET /api/resume/preview
  GET /api/resume/download

SRE Lab:

- fetch projects from GET /api/projects
- fallback to projects.mock.ts

Social Tower:

- fetch links from GET /api/social-links
- fallback to socialLinks.mock.ts

Reliance Jio coding loop:

- fetch dummy code snippet from:
  GET /api/snippets/jio-work
- fallback to local mock snippet if backend is unavailable
- keep typing animation working even when backend fails

AI Code Building:

- fetch AI tools from GET /api/ai-tools
- fallback to aiTools.mock.ts

Music Player:

- fetch tracks from GET /api/music/tracks
- stream from GET /api/music/stream/{trackId}
- fallback to static mock asset if needed

Rules:

- Keep mock data as fallback.
- Do not remove working frontend behavior.
- Use typed API helpers.
- Handle loading and errors cleanly.
- Keep UI outside Canvas where possible.
- Make sure frontend and backend both run locally.

After implementation:

- list all created/modified files
- explain how to run frontend + backend together
- explain fallback behavior
- update root WORKFLOW.md with Phase 8 completion notes

Stop after Phase 8.
Do not continue to Phase 9.