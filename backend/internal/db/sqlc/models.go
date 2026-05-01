package sqlc

import "context"

// Minimal types and interface stubs for compilation. These are placeholders
// until sqlc-generated code is available.

type Project struct {
	Slug     string `json:"slug"`
	Name     string `json:"name"`
	Featured bool   `json:"featured"`
}

type Skill struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type CreateAnalyticsEventParams struct {
	ID          string  `json:"id"`
	SessionID   string  `json:"sessionId"`
	RoomVisited string  `json:"roomVisited"`
	ProjectSlug *string `json:"projectSlug"`
	DurationMs  int32   `json:"durationMs"`
	UserAgent   *string `json:"userAgent"`
}

type Querier interface {
	ListAllProjects(ctx context.Context) ([]Project, error)
	ListFeaturedProjects(ctx context.Context) ([]Project, error)
	GetProjectBySlug(ctx context.Context, slug string) (Project, error)
	ListSkills(ctx context.Context) ([]Skill, error)
	CreateAnalyticsEvent(ctx context.Context, arg CreateAnalyticsEventParams) (int64, error)
}
