package session

import (
	"context"
	"net/http"

	"koopfeedback.de/internal/models"
	"koopfeedback.de/internal/util"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type POSTJoinSession struct {
	Code int    `bindings:"required"`
	Name string `bindings:"required"`
}

func (c *Controller) JoinSession(ctx *gin.Context) {

	bCtx := context.Background()
	body, hasBody := util.APIBindBody[POSTJoinSession](ctx)

	if !hasBody {
		util.APIErrorResponse[POSTJoinSession](ctx, "INVALID_BODY", http.StatusConflict)
		return
	}

	authId := uuid.New().String()

	session, err := gorm.G[models.Session](c.DB).Where("code = ?", body.Code).First(bCtx)
	if err != nil {
		util.APIErrorResponse[any](ctx, err.Error(), http.StatusInternalServerError)
		return
	}
	err = gorm.G[models.User](c.DB).Create(bCtx, &models.User{
		APIAuth: &models.APIAccess{
			Token: authId,
		},
		Name:         body.Name,
		HasSubmitted: false,
		IsHost:       false,
		Feedback:     nil,
		SessionID:    int(session.ID),
	})
	if err != nil {
		util.APIErrorResponse[any](ctx, err.Error(), http.StatusInternalServerError)
		return
	}

	ctx.JSON(200, util.DefaultAPIResponse[any]{
		Success: true,
		Message: "JOINED",
		Data: gin.H{
			"authId": authId,
		},
	})

}
