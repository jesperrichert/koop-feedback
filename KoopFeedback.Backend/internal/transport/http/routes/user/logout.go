package user

import (
	"context"
	"net/http"

	"koopfeedback.de/internal/models"
	"koopfeedback.de/internal/util"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func (c *Controller) Logout(ctx *gin.Context) {
	bCtx := context.Background()

	userId, _ := ctx.Get("userId")

	user, err := gorm.G[models.User](c.DB).Preload("Feedback", nil).Where("id = ?", userId).First(bCtx)
	if err != nil {
		util.APIErrorResponse[any](ctx, err.Error(), http.StatusInternalServerError)
		return
	}

	c.DB.Delete(&user.Feedback)

	ctx.JSON(200, util.DefaultAPIResponse[any]{
		Success: true,
		Message: "LOGOUT",
	})
	return
}
