-- This file is kept in sync with Prisma migrations and consumed by sqlc.
CREATE TYPE skill_category AS ENUM ('LANGUAGE','FRAMEWORK','DEVOPS','DATABASE','CLOUD','TOOL');
CREATE TYPE artifact_type AS ENUM ('CONCURRENCY_ORB','K8S_CLUSTER','PIPELINE_SCROLL','CRYSTAL');

CREATE TABLE "Project" (
  id            TEXT PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  "shortDesc"   VARCHAR(280) NOT NULL,
  description   TEXT NOT NULL,
  "techStack"   TEXT[] NOT NULL,
  "githubUrl"   TEXT,
  "liveUrl"     TEXT,
  "imageUrl"    TEXT,
  featured      BOOLEAN NOT NULL DEFAULT false,
  "pedestalX"   DOUBLE PRECISION NOT NULL DEFAULT 0,
  "pedestalY"   DOUBLE PRECISION NOT NULL DEFAULT 0,
  "pedestalZ"   DOUBLE PRECISION NOT NULL DEFAULT 0,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Skill" (
  id           TEXT PRIMARY KEY,
  name         TEXT UNIQUE NOT NULL,
  category     skill_category NOT NULL,
  proficiency  INTEGER NOT NULL,
  "artifactType" artifact_type NOT NULL,
  description  TEXT,
  "iconUrl"    TEXT,
  "shelfX"     DOUBLE PRECISION NOT NULL DEFAULT 0,
  "shelfY"     DOUBLE PRECISION NOT NULL DEFAULT 0,
  "shelfZ"     DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "VisitorAnalytics" (
  id            TEXT PRIMARY KEY,
  "sessionId"   VARCHAR(64) NOT NULL,
  "roomVisited" VARCHAR(32) NOT NULL,
  "projectSlug" VARCHAR(128),
  "durationMs"  INTEGER NOT NULL DEFAULT 0,
  "userAgent"   TEXT,
  country       VARCHAR(8),
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
