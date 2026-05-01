package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/AnujTiwari-Student/castle-portfolio/backend/internal/db/sqlc"
)

type AnalyticsHandler struct{ q sqlc.Querier }

func NewAnalyticsHandler(q sqlc.Querier) *AnalyticsHandler { return &AnalyticsHandler{q: q} }

type analyticsRequest struct {
	SessionID   string  `json:"sessionId" binding:"required"`
	RoomVisited string  `json:"roomVisited" binding:"required"`
	ProjectSlug *string `json:"projectSlug"`
	DurationMs  int32   `json:"durationMs"`
}

func (h *AnalyticsHandler) Track(c *gin.Context) {
	var req analyticsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ua := c.Request.UserAgent()
	_, err := h.q.CreateAnalyticsEvent(c.Request.Context(), sqlc.CreateAnalyticsEventParams{
		ID:          uuid.NewString(),
		SessionID:   req.SessionID,
		RoomVisited: req.RoomVisited,
		ProjectSlug: req.ProjectSlug,
		DurationMs:  req.DurationMs,
		UserAgent:   &ua,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"ok": true})
}
