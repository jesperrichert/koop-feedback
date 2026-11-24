package session

import (
	"math"
	"net/http"

	"koopfeedback.de/internal/dto"
	"koopfeedback.de/internal/util"

	"github.com/gin-gonic/gin"
)

func (c *Controller) PostSessionFeedback(ctx *gin.Context) {
	body, hasBody := util.APIBindBody[dto.AddFeedbackRequest](ctx)
	if !hasBody {
		util.APIErrorResponse[dto.AddFeedbackRequest](ctx, "FEEDBACK_ADD_FAILED", http.StatusBadRequest)
		return
	}
	userId, _ := ctx.Get("userId")

	success, status := c.SessionService.AddFeedback(userId.(int), body.Feedback)

	ctx.JSON(status, util.DefaultAPIResponse[dto.AddFeedbackResponse]{
		Success: true,
		Code:    "FEEDBACK",
		Data: dto.AddFeedbackResponse{
			Success: success,
			Failed:  int(math.Abs(float64(len(body.Feedback) - success))),
		},
	})
}
