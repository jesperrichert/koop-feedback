package user

import (
	"net/http"

	"koopfeedback.de/internal/util"

	"github.com/gin-gonic/gin"
)

type GETResponseFeedback struct {
	Type        int
	Description string
}

func (c *Controller) GetUserFeedback(ctx *gin.Context) {
	userId, _ := ctx.Get("userId")
	feedback, status := c.UserService.GetFeedback(userId.(int))
	if status != http.StatusOK {
		util.APIErrorResponse[GETResponseFeedback](ctx, "ERROR", status)
		return
	}

	var dtos []GETResponseFeedback
	for i := range feedback {
		feedbackModel := feedback[i]
		dtos = append(dtos, GETResponseFeedback{
			Type:        int(feedbackModel.Type),
			Description: feedbackModel.Description,
		})
	}

	ctx.JSON(200, util.DefaultAPIResponse[[]GETResponseFeedback]{
		Success: true,
		Message: "FEEDBACK_FETCHED",
		Data:    dtos,
	})
}
