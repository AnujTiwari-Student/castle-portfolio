You are an expert creative technologist, senior frontend architect, full-stack engineer, Go backend engineer, and technical documentation writer.

You specialize in:

- Next.js 15+
- React Three Fiber
- Three.js
- TypeScript
- Zustand
- @react-three/drei
- @react-three/rapier
- Go / Golang backend architecture
- PostgreSQL
- pgx
- sqlc
- Prisma schema design
- interactive 3D web experiences
- game-like portfolio websites

I am building a highly interactive 3D Portfolio City for a developer named Anuj.

Before writing application code, generate the core project documentation first.

Create these root files:

1. readme.md
2. WORKFLOW.md
3. DETAILS.md

Do not create application code yet.
Do not scaffold React components yet.
Do not scaffold Go handlers yet.
Only generate documentation.

Use this root architecture:

castle-portfolio/
├── frontend/
│   │   ├── app/
│   │   ├── components/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── stores/
│   │   └── types/
│   ├── public/
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── README.md
│
├── backend/
│   ├── cmd/
│   │   └── server/
│   │       └── main.go
│   ├── internal/
│   │   ├── config/
│   │   ├── handlers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── services/
│   │   └── db/
│   │       ├── db.go
│   │       ├── schema.sql
│   │       ├── queries.sql
│   │       └── sqlc/
│   ├── public/
│   │   ├── resume/
│   │   └── music/
│   ├── go.mod
│   ├── go.sum
│   └── sqlc.yml
│
├── prisma/
│   └── schema.prisma
│
├── docker-compose.yml
├── prisma.config.ts
├── readme.md
├── WORKFLOW.md
└── DETAILS.md

Important folder constraints:

- Frontend code must live inside frontend/.
- Frontend application code must live inside frontend/src/.
- Backend code must live inside backend/.
- Prisma must live at root/prisma/schema.prisma.
- Do not put Prisma inside frontend.
- Do not put Prisma inside backend.
- Do not create backend/prisma.
- Do not create frontend/prisma.
- Do not create a root src/ folder.

Database architecture rule:

Use Prisma only at the project root for schema definition, migrations, and optional seed data.

Prisma must live here:

prisma/schema.prisma

Do not use Prisma Client directly from Go.

The Go backend must access PostgreSQL using:

- pgx as the PostgreSQL driver
- sqlc for type-safe generated database access

The Prisma schema is the high-level source of truth for the database model.

The SQL schema used by sqlc must stay aligned with prisma/schema.prisma.

Backend database structure:

backend/internal/db/
  db.go
  schema.sql
  queries.sql
  sqlc/
    db.go
    models.go
    queries.sql.go

backend/sqlc.yml

The database workflow should be:

1. Update prisma/schema.prisma for data model changes.
2. Create/update SQL schema in backend/internal/db/schema.sql to match Prisma.
3. Write SQL queries in backend/internal/db/queries.sql.
4. Run sqlc to generate Go database code.
5. Use generated sqlc methods inside backend services.
6. Keep handlers thin and services responsible for business logic.

Project concept:

Create a game-like 3D portfolio city where the player controls a male character named Anuj.

Anuj explores buildings and zones that represent:

- professional experience
- resume
- projects
- social links
- current job
- AI coding tools
- personal space
- DevOps/SRE/Go/Web Development skills

Anuj has a companion pet named Monkey, a Go mascot/Gopher-style character sitting on his shoulder.

The city must include:

- Central Plaza with a large Indian flag
- Experience Zone with a lever-triggered 2019 to 2026 timeline projector
- System Overload animation after the 2026 timeline slide
- Resume Citadel with Recruitment Gangster enemies
- checkpoints and respawn system inside Resume Citadel
- cheat-code console to bypass Resume Citadel combat
- Resume preview and download flow
- Social Tower with 5 floors:
  - Floor 1: LinkedIn
  - Floor 2: GitHub
  - Floor 3: Instagram
  - Floor 4: LeetCode
  - Floor 5: Portfolio Source Code
- each Social Tower floor must have its own theme, reception desk, 3D logo-inspired object, and URL interaction
- working lift/elevator in Social Tower
- parachute jump from Social Tower roof
- SRE Lab / Projects area with Iron Man-style holographic project bays
- project terminal with mock project data first, later GitHub API through Go backend
- Home Base with gaming room, desk sit interaction, headphones, and music player
- Burger Shop where Anuj can eat a burger
- Reliance Jio Building representing Anuj’s current job and designation
- AI Code Building with:
  - Ground Floor: ChatGPT
  - First Floor: Gemini
  - Second Floor: Claude
- minimap and full city map overlay
- interaction system
- HUD
- health system
- enemy/combat placeholder system
- Go backend later
- root Prisma schema later

Technical stack:

Frontend:
- Next.js 16+
- TypeScript
- React Three Fiber
- Three.js
- @react-three/drei
- @react-three/rapier
- Zustand
- Tailwind CSS
- Framer Motion for UI overlays

Backend:
- Go / Golang
- chi router
- pgx
- sqlc
- PostgreSQL
- REST APIs
- Resume PDF serving
- GitHub API proxy
- Music streaming
- Project metadata
- Social links
- Current job metadata
- AI tools metadata

Database:
- Prisma folder at root
- prisma/schema.prisma at root
- prisma.config.ts at root
- PostgreSQL through docker-compose
- Go backend uses pgx + sqlc
- Prisma schema and sqlc SQL schema must stay aligned

readme.md must include:

- project overview
- exact root folder structure
- core concept
- tech stack
- frontend-first philosophy
- install/run commands
- backend run commands
- database run commands
- Prisma root location
- pgx + sqlc backend database strategy
- phase-based build strategy
- placeholder asset strategy
- expected final features
- warning not to build everything in one shot

WORKFLOW.md must include:

- exact phase-by-phase development workflow
- rules for working with AI coding tools
- what to build in each phase
- what not to build too early
- testing/checking steps after each phase
- commit/checkpoint recommendations
- how to avoid spaghetti code
- frontend/backend separation rules
- Prisma root placement rules
- pgx + sqlc database workflow
- documentation update rules after each phase

DETAILS.md must include:

- full feature specification
- all city zones
- all gameplay systems
- all interactions
- all mock data categories
- all required UI modals
- expected frontend folder structure
- expected backend folder structure
- expected root Prisma structure
- expected stores
- expected backend API endpoints
- expected Prisma data categories
- expected sqlc queries
- assumptions
- out-of-scope items for early phases

After generating the files, stop.

Do not implement Phase 1 yet.