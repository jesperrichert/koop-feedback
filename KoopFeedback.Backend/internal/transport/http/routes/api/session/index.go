package session

import (
	"net/http"

	"koopfeedback.de/internal/dto"
	"koopfeedback.de/internal/util"

	"github.com/gin-gonic/gin"
)

func (c *Controller) Create(ctx *gin.Context) {
	body, ok := util.APIBindBody[dto.AddSessionRequest](ctx)

	if !ok {
		util.APIErrorResponse[dto.AddSessionRequest](ctx, "INVALID_BODY", http.StatusConflict)
		return
	}

	if len(body.HostName) <= 2 {
		util.APIErrorResponse[any](ctx, "TOO_SHORT_HOSTNAME", http.StatusBadRequest)
		return
	}

	authId, status := c.SessionService.Create(body.HostName)
	if status != http.StatusCreated {
		util.APIErrorResponse[any](ctx, "CREATE_FAILED", status)
		return
	}

	ctx.JSON(200, util.DefaultAPIResponse[any]{
		Success: true,
		Code:    "SESSION",
		Data: gin.H{
			"authId": authId,
		},
	})
	return
}

func (c *Controller) Get(ctx *gin.Context) {
	userId, _ := ctx.Get("userId")

	userModels, session, status := c.SessionService.Get(userId.(uint))
	if status != http.StatusOK {
		util.APIErrorResponse[any](ctx, "FAILED_FETCH_SESSION", status)
	}

	var user dto.UserDto
	for i := range userModels {
		userModel := userModels[i]
		if userModel.ID == userId.(uint) {
			user = userModel.ToDto()
		}
	}

	var users []dto.UserDto
	for i := range userModels {
		users = append(users, userModels[i].ToDto())
	}

	ctx.JSON(200, util.DefaultAPIResponse[dto.GetSessionResponse]{
		Success: true,
		Code:    "SESSION",
		Data: dto.GetSessionResponse{
			Self:    user,
			Session: session.ToDto(),
			Users:   users,
		},
	})
}
