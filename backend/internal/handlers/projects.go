package handlers

import (
	"net/http"

	"github.com/AnujTiwari-Student/castle-portfolio/backend/internal/db/sqlc"
	"github.com/gin-gonic/gin"
)

type ProjectHandler struct {
	q sqlc.Querier
}

func NewProjectHandler(q sqlc.Querier) *ProjectHandler {
	return &ProjectHandler{q: q}
}

func (h *ProjectHandler) List(c *gin.Context) {
	projects, err := h.q.ListAllProjects(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, projects)
}

func (h *ProjectHandler) Featured(c *gin.Context) {
	projects, err := h.q.ListFeaturedProjects(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, projects)
}

func (h *ProjectHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")
	p, err := h.q.GetProjectBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "project not found"})
		return
	}
	c.JSON(http.StatusOK, p)
}
