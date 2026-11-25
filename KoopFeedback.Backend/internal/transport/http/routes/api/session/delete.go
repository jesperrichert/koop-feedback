package session

import (
	"net/http"

	"koopfeedback.de/internal/util"

	"github.com/gin-gonic/gin"
)

func (c *Controller) EndSession(ctx *gin.Context) {
	userId, _ := ctx.Get("userId")

	status := c.SessionService.Delete(userId.(int))
	if status != http.StatusOK {
		util.APIErrorResponse[any](ctx, "END_FAILED", status)
		return
	}

	ctx.JSON(http.StatusOK, util.DefaultAPIResponse[any]{
		Success: true,
		Code:    "SESSION_ENDED",
	})
}
