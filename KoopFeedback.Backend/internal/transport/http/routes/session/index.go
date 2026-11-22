package session

import (
	"context"
	"fmt"
	"math/rand/v2"
	"net/http"
	"strconv"

	"koopfeedback.de/internal/models"
	"koopfeedback.de/internal/util"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type POSTSession struct {
	HostName string
}

func (c *Controller) CreateSession(ctx *gin.Context) {
	bCtx := context.Background()
	body, hasBody := util.APIBindBody[POSTSession](ctx)

	if !hasBody {
		util.APIErrorResponse[POSTSession](ctx, "INVALID_BODY", http.StatusConflict)
		return
	}

	if len(body.HostName) <= 2 {
		util.APIErrorResponse[any](ctx, "You name is to short. (min 2 characters)", http.StatusBadRequest)
		return
	}

	authId := uuid.New().String()
	uniqueCode := false
	code, _ := strconv.Atoi(fmt.Sprintf("%06d", rand.IntN(1_000_000)))
	for !uniqueCode {
		code, _ = strconv.Atoi(fmt.Sprintf("%06d", rand.IntN(1_000_000)))
		session, err := gorm.G[models.Session](c.DB).Where("code = ?", code).First(context.Background())
		if err != nil && session.ID == 0 {
			uniqueCode = true
		}
	}

	err := gorm.G[models.User](c.DB).Create(bCtx, &models.User{
		APIAuth: &models.APIAccess{
			Token: authId,
		},
		Name:         body.HostName,
		HasSubmitted: false,
		IsHost:       true,
		Feedback:     nil,
		Session: models.Session{
			Code:       code,
			IsStarted:  false,
			IsFinished: false,
		},
	})

	if err != nil {
		util.APIErrorResponse[POSTSession](ctx, "Failed to create session!", http.StatusBadRequest)
		return
	}

	ctx.JSON(200, util.DefaultAPIResponse[any]{
		Success: true,
		Message: "SESSION",
		Data: gin.H{
			"authId": authId,
		},
	})
	return
}

type GETResponseSession struct {
	Self    models.User
	Session models.Session
	Users   []models.User
}

func (c *Controller) GetSession(ctx *gin.Context) {
	bCtx := context.Background()
	userId, _ := ctx.Get("userId")

	user, err := gorm.G[models.User](c.DB).Where("id = ?", userId).First(bCtx)
	if err != nil {
		util.APIErrorResponse[any](ctx, err.Error(), http.StatusBadRequest)
		return
	}

	session, err := gorm.G[models.Session](c.DB).Where("id = ?", user.SessionID).First(bCtx)
	if err != nil {
		util.APIErrorResponse[any](ctx, err.Error(), http.StatusBadRequest)
		return
	}
	users, err := gorm.G[models.User](c.DB).Where("session_id = ?", session.ID).Find(bCtx)
	if err != nil {
		util.APIErrorResponse[any](ctx, err.Error(), http.StatusBadRequest)
		return
	}

	ctx.JSON(200, util.DefaultAPIResponse[GETResponseSession]{
		Success: true,
		Message: "SESSION - USERS",
		Data: GETResponseSession{
			Self:    user,
			Session: session,
			Users:   users,
		},
	})
	return

}
