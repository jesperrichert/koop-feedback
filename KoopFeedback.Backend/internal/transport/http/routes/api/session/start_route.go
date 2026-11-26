package session

import (
	"net/http"

	"koopfeedback.de/internal/util"

	"github.com/gin-gonic/gin"
)

func (c *Controller) Start(ctx *gin.Context) {
	userId, _ := ctx.Get("userId")

	status := c.SessionService.Start(userId.(uint))
	if status != http.StatusOK {
		util.APIErrorResponse[any](ctx, "START_FAILED", status)
		return
	}

	ctx.JSON(200, util.DefaultAPIResponse[any]{
		Success: true,
		Code:    "SESSION_STARTED",
	})
}
