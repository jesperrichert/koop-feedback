package session

import (
	"context"
	"net/http"

	"koopfeedback.de/internal/models"
	util2 "koopfeedback.de/internal/util"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func (c *Controller) StartSession(ctx *gin.Context) {
	bCtx := context.Background()
	userId, _ := ctx.Get("userId")

	isHost := util2.IsUserHostByUserId(c.DB, userId.(int))
	if !isHost {
		util2.APIHostError(ctx)
		return
	}

	user, err := gorm.G[models.User](c.DB).Preload("Session", nil).Where("id = ?", userId).First(bCtx)
	if err != nil {
		util2.APIErrorResponse[any](ctx, err.Error(), http.StatusInternalServerError)
		return
	}
	session, err := gorm.G[models.Session](c.DB).Preload("Users", nil).Where("id = ?", user.SessionID).First(bCtx)
	if err != nil {
		util2.APIErrorResponse[any](ctx, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(session.Users) < 2 {
		util2.APIErrorResponse[any](ctx, "NotEnoughUsers", http.StatusConflict)
		return
	}
	if user.Session.IsStarted {
		util2.APIErrorResponse[any](ctx, "IsStarted", http.StatusConflict)
		return
	}
	if user.Session.IsFinished {
		util2.APIErrorResponse[any](ctx, "IsFinished", http.StatusConflict)
		return
	}

	_, err = gorm.G[models.Session](c.DB).Where("id = ?", user.SessionID).Update(bCtx, "is_started", true)
	if err != nil {
		util2.APIErrorResponse[any](ctx, err.Error(), http.StatusInternalServerError)
		return
	}

	ctx.JSON(200, util2.DefaultAPIResponse[any]{
		Success: true,
		Message: "STARTED",
	})
}
