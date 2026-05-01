package handlers

import (
	"net/http"

	"github.com/AnujTiwari-Student/castle-portfolio/backend/internal/db/sqlc"
	"github.com/gin-gonic/gin"
)

type SkillHandler struct{ q sqlc.Querier }

func NewSkillHandler(q sqlc.Querier) *SkillHandler { return &SkillHandler{q: q} }

func (h *SkillHandler) List(c *gin.Context) {
	skills, err := h.q.ListSkills(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, skills)
}
