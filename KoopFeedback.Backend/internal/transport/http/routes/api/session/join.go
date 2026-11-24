package session

import (
	"net/http"

	"koopfeedback.de/internal/dto"
	"koopfeedback.de/internal/util"

	"github.com/gin-gonic/gin"
)

func (c *Controller) JoinSession(ctx *gin.Context) {
	body, hasBody := util.APIBindBody[dto.JoinSessionRequest](ctx)

	if !hasBody {
		util.APIErrorResponse[dto.JoinSessionRequest](ctx, "INVALID_BODY", http.StatusConflict)
		return
	}

	authId, status := c.SessionService.Join(body.Code, body.Name)
	if status != http.StatusOK {
		util.APIErrorResponse[dto.JoinSessionRequest](ctx, "JOIN_FAILED", status)
		return
	}

	ctx.JSON(200, util.DefaultAPIResponse[any]{
		Success: true,
		Code:    "JOINED",
		Data: gin.H{
			"authId": authId,
		},
	})

}
