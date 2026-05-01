-- name: ListFeaturedProjects :many
SELECT * FROM "Project"
WHERE featured = true
ORDER BY "displayOrder" ASC;

-- name: ListAllProjects :many
SELECT * FROM "Project"
ORDER BY "displayOrder" ASC, "createdAt" DESC;

-- name: GetProjectBySlug :one
SELECT * FROM "Project" WHERE slug = $1;

-- name: ListSkills :many
SELECT * FROM "Skill" ORDER BY category, proficiency DESC;

-- name: ListSkillsByCategory :many
SELECT * FROM "Skill" WHERE category = $1 ORDER BY proficiency DESC;

-- name: CreateAnalyticsEvent :one
INSERT INTO "VisitorAnalytics"
  (id, "sessionId", "roomVisited", "projectSlug", "durationMs", "userAgent", country)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: GetRoomVisitCounts :many
SELECT "roomVisited", COUNT(*) AS visits
FROM "VisitorAnalytics"
WHERE "createdAt" > NOW() - INTERVAL '30 days'
GROUP BY "roomVisited";
