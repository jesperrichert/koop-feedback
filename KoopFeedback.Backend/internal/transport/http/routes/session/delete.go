package session

import (
	"context"
	"net/http"
	"strconv"

	"koopfeedback.de/internal/models"
	"koopfeedback.de/internal/util"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func (c *Controller) EndSession(ctx *gin.Context) {
	bCtx := context.Background()
	userId, _ := ctx.Get("userId")

	isHost := util.DBCheckHostWithAuth(c.DB, strconv.Itoa(userId.(int)))
	if !isHost {
		util.APIHostError(ctx)
		return
	}

	user, err := gorm.G[models.User](c.DB).Preload("Session", nil).Where("id = ?", userId).First(bCtx)
	if err != nil {
		util.APIErrorResponse[any](ctx, err.Error(), http.StatusInternalServerError)
		return
	}

	if !user.Session.IsStarted {
		util.APIErrorResponse[any](ctx, "NotStarted", http.StatusConflict)
		return
	}
	if user.Session.IsFinished {
		util.APIErrorResponse[any](ctx, "IsFinished", http.StatusConflict)
		return
	}

	_, err = gorm.G[models.Session](c.DB).Where("id = ?", user.SessionID).Update(bCtx, "is_finished", true)
	if err != nil {
		util.APIErrorResponse[any](ctx, err.Error(), http.StatusInternalServerError)
		return
	}

	ctx.JSON(200, util.DefaultAPIResponse[any]{
		Success: true,
		Message: "FINISHED",
	})
}
