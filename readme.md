# Castle Portfolio — Implementation Guide

This guide walks you from zero to a running 3D portfolio.

## Prerequisites
- Node.js 20+, pnpm or npm
- Go 1.23+
- Docker (for Postgres)
- sqlc CLI: `go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest`
- Prisma CLI (auto-installed via npm)

---

## Step 1 — Bootstrap the repo
```bash
mkdir castle-portfolio && cd castle-portfolio
git init
# Copy the file structure described in section 1 of the scaffold.
```

## Step 2 — Start Postgres
```bash
docker compose up -d postgres
```

## Step 3 — Define the schema with Prisma
```bash
mkdir prisma && cd prisma
npm init -y
npm install -D prisma
npx prisma init
# replace the generated schema.prisma with the provided one
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/castle?schema=public"' > .env
npx prisma migrate dev --name init
```

Prisma is the **source of truth** for schema/migrations. Go never imports Prisma.

## Step 4 — Mirror the schema for sqlc
After a Prisma migration runs, dump the SQL into `backend/internal/db/schema.sql`:
```bash
pg_dump --schema-only --no-owner -h localhost -U postgres -d castle > backend/internal/db/schema.sql
```
Or maintain `schema.sql` by hand (faster for small projects). Either way, it must match the Prisma migration so sqlc generates correct Go types.

## Step 5 — Generate the Go query layer
```bash
cd backend
sqlc generate
```
This produces `internal/db/sqlc/{db.go,models.go,queries.sql.go}` with type-safe methods like `q.GetProjectBySlug(ctx, slug)`.

## Step 6 — Run the Go API
```bash
cp .env.example .env
go mod tidy
go run ./cmd/server
# -> server listening on :8080
curl http://localhost:8080/healthz
```

## Step 7 — Seed some content
Use Prisma Studio for a fast UI:
```bash
cd prisma && npx prisma studio
```
Or write a `prisma/seed.ts`. Place pedestal coordinates that match positions in `Forge.tsx`.

## Step 8 — Run the Next.js frontend
```bash
cd frontend
npm install
echo 'NEXT_PUBLIC_API_URL=http://localhost:8080' > .env.local
npm run dev
# Open http://localhost:3000
```

---

## 3D Component Logic

### Player movement
The `Player` uses `useSphere` from `@react-three/cannon` for collision. On each frame we read keyboard state, translate it into a velocity vector aligned with the camera yaw, and call `api.velocity.set`. Jumping is gated by checking the y-velocity is near zero (rough ground check).

### Camera
A third-person `FollowCamera` lerps toward `target + offset` and looks slightly above the player. To upgrade, swap to drei's `<PerspectiveCamera>` with `<CameraShake>` for impact.

### Proximity interaction
Each `ProjectPedestal` reads the shared `playerPos` ref every frame. If distance < 3 units, it sets `nearbyProject` in Zustand and the HUD shows the prompt. Pressing E calls `openProject(slug)`, which sets `isPaused = true` (freezing movement) and renders the `ProjectOverlay` modal. `ProjectOverlay` fetches data from `/api/backend/projects/:slug`, which Next.js rewrites to the Go API.

### Rooms
- **Forge**: walled area at `z = -8`, three pedestals with floating icosahedron orbs that pulse yellow when within range.
- **Library**: at `x = -18`, three "artifacts" — a `ConcurrencyOrb` (rotating goroutine particles around a Go-blue core), a `K8sCluster` (3×3 grid of blue cubes), and a `PipelineScroll` (4 stage cylinders).
- **Lookout**: at `x = +18`, three rotating torus rings as social portals. Clicking opens the URL in a new tab.

### Performance tips
- Wrap heavy meshes in `<Detailed>` for LOD.
- Use `<Instances>` from drei for repeated geometries (e.g., K8s nodes scaled up).
- Cap `dpr` to `[1, 2]` and use `<Preload all />`.
- Lazy-load room components with `React.lazy` once you split rooms into separate files.

---

## sqlc + Prisma Workflow

1. Edit `prisma/schema.prisma`.
2. Run `npx prisma migrate dev --name <change>`.
3. Update `backend/internal/db/schema.sql` to match (manually or via `pg_dump`).
4. Add/modify queries in `backend/internal/db/queries.sql`.
5. Run `sqlc generate`.
6. Use the generated `Querier` interface in handlers.

The Go side has zero runtime dependency on Prisma — sqlc reads SQL files at build time and emits plain Go.

---

## Deployment Sketch

- **Frontend** → Vercel. Set `NEXT_PUBLIC_API_URL` to the public Go URL.
- **Backend** → Fly.io / Railway / Render. Single binary, point `DATABASE_URL` at managed Postgres (Neon, Supabase, RDS).
- **Migrations** → Run `npx prisma migrate deploy` from CI before rolling the Go service.
- **Analytics** → The `/api/v1/analytics` endpoint is fire-and-forget; consider sending from a `sendBeacon` on `pagehide` for accurate room-time tracking.

---

## Roadmap / Polish

- Replace the sphere player with a rigged GLB (Mixamo + drei `useAnimations`).
- Add `EffectComposer` + `Bloom` on the orbs for that magic glow.
- Switch `Sky` to an HDRI for cinematic lighting.
- Mobile: detect touch and render an on-screen joystick.
- Add `usePointerLock` for FPS-style mouse look.
- Replace cuboid walls with imported castle GLB and use `useGLTF` + `useCompoundBody` for collisions.

