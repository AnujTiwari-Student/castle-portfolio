Read root readme.md, WORKFLOW.md, DETAILS.md, and the current codebase.

Now implement Phase 9 only: Database Layer with Root Prisma + PostgreSQL + pgx + sqlc.

Hard constraints:

- Prisma must remain at root/prisma/schema.prisma.
- Do not move Prisma into backend.
- Do not move Prisma into frontend.
- Do not use Prisma Client from Go.
- Go backend must use pgx + sqlc.
- PostgreSQL is the database.
- Frontend must not talk directly to the database.
- Backend handlers must not contain raw SQL.
- Services should call sqlc-generated query methods.

Goal:

Create a clean database layer where Prisma defines the high-level data model and migrations, while Go uses sqlc-generated type-safe database methods.

Implement:

1. root prisma/schema.prisma
2. root prisma.config.ts
3. root docker-compose.yml with PostgreSQL
4. backend/internal/db/schema.sql
5. backend/internal/db/queries.sql
6. backend/sqlc.yml
7. backend/internal/db/db.go using pgxpool
8. generated sqlc package structure
9. service-layer integration
10. mock fallback when DB is unavailable

Database architecture rule:

Prisma is used for:

- schema definition
- migrations
- optional seed data
- data model documentation

Go backend uses:

- pgx as PostgreSQL driver
- sqlc for type-safe generated database access

The Prisma schema is the high-level source of truth.

The SQL schema used by sqlc must stay aligned with prisma/schema.prisma.

Create this exact Prisma schema at root/prisma/schema.prisma:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ProjectStatus {
  PLANNED
  IN_PROGRESS
  LIVE
  ARCHIVED
}

enum SocialPlatform {
  LINKEDIN
  GITHUB
  INSTAGRAM
  LEETCODE
  PORTFOLIO_SOURCE
}

enum AIToolName {
  CHATGPT
  GEMINI
  CLAUDE
}

model Experience {
  id          String   @id @default(cuid())
  year        Int
  title       String
  company     String?
  role        String?
  description String
  techStack   String[]
  highlights  String[]
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([year])
  @@index([order])
}

model Project {
  id          String        @id @default(cuid())
  name        String
  slug        String        @unique
  description String
  techStack   String[]
  githubUrl   String?
  liveUrl     String?
  status      ProjectStatus @default(IN_PROGRESS)
  featured    Boolean       @default(false)
  order       Int           @default(0)
  mockStars   Int           @default(0)
  mockForks   Int           @default(0)
  codeSnippet String?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([slug])
  @@index([featured])
  @@index([order])
}

model SocialLink {
  id        String         @id @default(cuid())
  platform  SocialPlatform
  label     String
  url       String
  floor     Int
  theme     String
  order     Int            @default(0)
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt

  @@index([platform])
  @@index([floor])
}

model CurrentJob {
  id              String   @id @default(cuid())
  company         String
  designation     String
  roleDescription String
  focusAreas      String[]
  tools           String[]
  startDate       DateTime?
  location        String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model AITool {
  id        String     @id @default(cuid())
  name      AIToolName
  floor     Int
  label     String
  usage     String
  theme     String
  order     Int        @default(0)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  @@index([name])
  @@index([floor])
}

model MusicTrack {
  id        String   @id @default(cuid())
  title     String
  artist    String?
  src       String
  order     Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([order])
  @@index([isActive])
}

model ResumeMetadata {
  id          String   @id @default(cuid())
  fileName    String
  previewUrl  String
  downloadUrl String
  version     String?
  isActive    Boolean  @default(true)
  updatedAt   DateTime @updatedAt
  createdAt   DateTime @default(now())

  @@index([isActive])
}