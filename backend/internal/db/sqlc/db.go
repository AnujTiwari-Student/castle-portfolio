package sqlc

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Queries struct {
	pool *pgxpool.Pool
}

func New(pool *pgxpool.Pool) Querier {
	return &Queries{pool: pool}
}

func (q *Queries) ListAllProjects(ctx context.Context) ([]Project, error) {
	return []Project{}, nil
}

func (q *Queries) ListFeaturedProjects(ctx context.Context) ([]Project, error) {
	return []Project{}, nil
}

func (q *Queries) GetProjectBySlug(ctx context.Context, slug string) (Project, error) {
	return Project{}, errors.New("not found")
}

func (q *Queries) ListSkills(ctx context.Context) ([]Skill, error) {
	return []Skill{}, nil
}

func (q *Queries) CreateAnalyticsEvent(ctx context.Context, arg CreateAnalyticsEventParams) (int64, error) {
	return 1, nil
}
