package user

import (
	"net/http"

	"koopfeedback.de/internal/dto"
	"koopfeedback.de/internal/util"

	"github.com/gin-gonic/gin"
)

func (c *Controller) GetUserFeedback(ctx *gin.Context) {
	userId, _ := ctx.Get("userId")
	feedback, status := c.UserService.GetFeedback(userId.(int))
	if status != http.StatusOK {
		util.APIErrorResponse[dto.FeedbackDto](ctx, "ERROR", status)
		return
	}

	var dtos []dto.FeedbackDto
	for i := range feedback {
		feedbackModel := feedback[i]
		dtos = append(dtos, dto.FeedbackDto{
			Type:        feedbackModel.Type,
			Description: feedbackModel.Description,
		})
	}

	ctx.JSON(200, util.DefaultAPIResponse[[]dto.FeedbackDto]{
		Success: true,
		Code:    "FEEDBACK_FETCHED",
		Data:    dtos,
	})
}
