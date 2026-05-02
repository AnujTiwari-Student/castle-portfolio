Read root readme.md, WORKFLOW.md, DETAILS.md, and the current codebase.

Now implement Phase 7 only: Go Backend Scaffold.

Hard constraints:

- Backend code must live inside backend/.
- Do not move Prisma.
- Do not use Prisma Client from Go.
- Prisma remains at root/prisma/schema.prisma.
- Do not connect frontend to backend yet.
- Do not implement the full database layer yet.
- Database integration comes in Phase 9.
- For now, return mock JSON from backend services.

Goal:

Create the Go backend foundation for the 3D Portfolio City.

Use:

- Go
- chi router
- pgx dependency prepared for later
- sqlc structure prepared for later
- REST APIs
- clean handlers/services separation

Backend responsibilities:

- health check
- resume preview/download
- project metadata endpoint
- GitHub repo stats proxy structure
- social links endpoint
- current job endpoint
- AI tools endpoint
- music tracks endpoint
- music streaming endpoint placeholder
- experience timeline endpoint

Create this backend structure:

backend/
  cmd/
    server/
      main.go

  internal/
    config/
      config.go

    handlers/
      health.go
      resume.go
      projects.go
      github.go
      music.go
      social.go
      current_job.go
      ai_tools.go
      experience.go

    services/
      project_service.go
      github_service.go
      music_service.go
      resume_service.go
      social_service.go
      current_job_service.go
      ai_tools_service.go
      experience_service.go

    models/
      project.go
      experience.go
      social.go
      current_job.go
      ai_tool.go
      music.go
      resume.go

    middleware/
      cors.go
      logging.go

    db/
      db.go
      schema.sql
      queries.sql
      sqlc/
        .gitkeep

  public/
    resume/
      anuj-resume.pdf

    music/
      track-1.mp3

  go.mod
  go.sum
  sqlc.yml

Required endpoints:

GET /api/health

GET /api/resume/preview
GET /api/resume/download

GET /api/projects
GET /api/projects/{id}
GET /api/github/repo-stats?owner=&repo=

GET /api/experience

GET /api/social-links

GET /api/current-job

GET /api/ai-tools

GET /api/music/tracks
GET /api/music/stream/{trackId}

Implementation requirements:

- Use chi router.
- Add CORS middleware for local frontend development.
- Add logging middleware.
- Use mock JSON responses for now.
- Resume download should serve a PDF from backend/public/resume/anuj-resume.pdf.
- If the PDF file does not exist, return a clear error instead of crashing.
- Music stream should serve a static file placeholder if available.
- GitHub service should be structured for future real API calls but can return mock data for now.
- Keep handlers thin.
- Put business logic in services.
- Add environment config structure.
- Prepare db package but do not require a live DB yet.
- Add sqlc.yml scaffold but do not require generated files yet.

Frontend integration:

- Do not fully switch frontend from mocks yet.
- Only document the API base URL expected later.
- Keep frontend stable.

After implementation:

- list all created/modified files
- explain how to run backend
- explain available endpoints
- explain which endpoints still return mock data
- update root WORKFLOW.md with Phase 7 completion notes

Snippet endpoint:
- add backend/public/snippets/jio_work.go
- add backend/internal/handlers/snippets.go
- add backend/internal/services/snippet_service.go
- add endpoint:
  GET /api/snippets/jio-work
- endpoint should return the contents of backend/public/snippets/jio_work.go as plain text or JSON with a code field
- if file is missing, return a clear error

Stop after Phase 7.
Do not continue to Phase 8.