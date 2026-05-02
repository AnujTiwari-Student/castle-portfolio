
---

# Part 10 — Polish and Production Hardening

```md
Read root readme.md, WORKFLOW.md, DETAILS.md, and the current codebase.

Now implement Phase 10 only: Polish and Production Hardening.

Hard constraints:

- Do not rewrite the architecture.
- Do not move Prisma.
- Do not replace pgx + sqlc.
- Do not introduce a Go ORM.
- Do not break existing interactions.
- Do not remove mock fallbacks unless backend/database is confirmed stable.

Goal:

Improve the experience quality, performance, UX, loading states, backend reliability, and maintainability.

Polish areas:

1. loading screen
2. better HUD
3. better interaction prompts
4. better minimap visuals
5. smoother camera
6. better placeholder materials
7. better lighting
8. simple sound effects
9. improved System Overload VFX
10. improved elevator/parachute feedback
11. better error/loading states for backend APIs
12. mobile/low-power fallback messaging
13. performance cleanup
14. backend error handling
15. database connection handling
16. documentation cleanup

Frontend performance requirements:

- avoid unnecessary physics bodies
- use simple colliders
- avoid unnecessary useFrame logic
- memoize repeated geometry/materials where useful
- lazy-load heavy UI modals where reasonable
- keep Canvas clean
- keep UI outside Canvas
- inspect obvious rerender issues

Backend hardening requirements:

- consistent JSON error responses
- request logging
- clean CORS config
- graceful missing-file handling for resume/music
- DB unavailable fallback behavior
- clean config validation
- no panics for expected runtime errors

Database hardening requirements:

- document Prisma/sqlc sync workflow
- confirm schema.sql matches prisma/schema.prisma
- confirm queries.sql covers required endpoints
- confirm sqlc generation works
- keep mock fallback for local dev

UX requirements:

- clear controls screen
- clear map/wayfinding
- clear interact prompts
- obvious checkpoint activation feedback
- obvious resume path/bypass
- never trap the user in combat
- make cheat code discoverable enough for portfolio reviewers
- make external URL navigation safe through confirmation modal

Testing checklist:

Frontend:

- test player movement
- test interactions
- test checkpoints
- test respawn
- test cheat code
- test resume preview/download
- test elevator
- test parachute
- test burger interaction
- test music player
- test project terminal
- test backend fallback behavior

Backend:

- test GET /api/health
- test GET /api/projects
- test GET /api/experience
- test GET /api/social-links
- test GET /api/current-job
- test GET /api/ai-tools
- test GET /api/music/tracks
- test GET /api/resume/preview
- test GET /api/resume/download
- test DB unavailable behavior
- test DB available behavior if PostgreSQL is running

After implementation:

- list all created/modified files
- explain polish improvements
- explain performance improvements
- explain backend hardening improvements
- explain database hardening improvements
- explain remaining known limitations
- update readme.md, WORKFLOW.md, and DETAILS.md to reflect the current state

Stop after Phase 10.