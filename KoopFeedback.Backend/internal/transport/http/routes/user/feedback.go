package user

import (
	"context"
	"net/http"

	"koopfeedback.de/internal/models"
	"koopfeedback.de/internal/util"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type GETResponseFeedback struct {
	Type        int
	Description string
}

func (c *Controller) GetUserFeedback(ctx *gin.Context) {
	bCtx := context.Background()

	userId, _ := ctx.Get("userId")

	feedback, err := gorm.G[models.FeedbackModel](c.DB).Preload("User", nil).Where("user_id = ?", userId).Find(bCtx)
	if err != nil {
		util.APIErrorResponse[GETUser](ctx, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(feedback) <= 0 {
		util.APIErrorResponse[GETResponseFeedback](ctx, "NOTHING", http.StatusInternalServerError)
		return
	}

	session, err := gorm.G[models.Session](c.DB).Where("id = ?", feedback[0].User.SessionID).First(bCtx)
	if err != nil {
		util.APIErrorResponse[GETUser](ctx, err.Error(), http.StatusInternalServerError)
		return
	}
	if !session.IsStarted {
		util.APIErrorResponse[GETResponseFeedback](ctx, "NotActive", http.StatusLocked)
		return
	}
	if !session.IsFinished {
		util.APIErrorResponse[GETResponseFeedback](ctx, "NotActive", http.StatusLocked)
		return
	}

	// Maybe i need to make this better...
	var filteredFeedback []GETResponseFeedback
	for i := range len(feedback) {
		f := feedback[i]
		filteredFeedback = append(filteredFeedback, GETResponseFeedback{
			Type:        int(f.Type),
			Description: f.Description,
		})

	}

	ctx.JSON(200, util.DefaultAPIResponse[[]GETResponseFeedback]{
		Success: true,
		Message: "FEEDBACK",
		Data:    filteredFeedback,
	})
	return
}
