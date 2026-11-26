package user

import (
	"net/http"

	"koopfeedback.de/internal/util"

	"github.com/gin-gonic/gin"
)

func (c *Controller) Logout(ctx *gin.Context) {
	userId, _ := ctx.Get("userId")
	status := c.UserService.Logout(userId.(uint))

	if status == http.StatusInternalServerError {
		util.APIErrorResponse[any](ctx, "LOGOUT_FAILED", http.StatusInternalServerError)
		return
	}

	ctx.JSON(200, util.DefaultAPIResponse[any]{
		Success: true,
		Code:    "LOGOUT",
	})
}
