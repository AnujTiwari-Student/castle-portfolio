package main

import (
	"context"
	"log"

	"github.com/AnujTiwari-Student/castle-portfolio/backend/internal/config"
	"github.com/AnujTiwari-Student/castle-portfolio/backend/internal/db"
	"github.com/AnujTiwari-Student/castle-portfolio/backend/internal/db/sqlc"
	"github.com/AnujTiwari-Student/castle-portfolio/backend/internal/handlers"
	"github.com/AnujTiwari-Student/castle-portfolio/backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()
	ctx := context.Background()

	pool, err := db.NewPool(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("db connect: %v", err)
	}
	defer pool.Close()

	queries := sqlc.New(pool)

	if cfg.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}
	r := gin.New()
	r.Use(gin.Recovery(), gin.Logger(), middleware.CORS(cfg.AllowOrigin))

	r.GET("/healthz", func(c *gin.Context) { c.JSON(200, gin.H{"status": "ok"}) })

	projectH := handlers.NewProjectHandler(queries)
	skillH := handlers.NewSkillHandler(queries)
	analyticsH := handlers.NewAnalyticsHandler(queries)

	api := r.Group("/api/v1")
	{
		api.GET("/projects", projectH.List)
		api.GET("/projects/featured", projectH.Featured)
		api.GET("/projects/:slug", projectH.GetBySlug)
		api.GET("/skills", skillH.List)
		api.POST("/analytics", analyticsH.Track)
	}

	log.Printf("server listening on :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
