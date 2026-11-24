package user

import (
	"net/http"

	"koopfeedback.de/internal/dto"
	"koopfeedback.de/internal/models"
	"koopfeedback.de/internal/util"

	"github.com/gin-gonic/gin"
)

func (c *Controller) Get(ctx *gin.Context) {
	uri, hasBody := util.APIBindUri[dto.GetUserRequest](ctx)

	if !hasBody {
		util.APIErrorResponse[dto.GetUserRequest](ctx, "INVALID_BODY", http.StatusConflict)
		return
	}

	user, status := c.UserService.Get(uri.ID)
	if status != http.StatusOK {
		util.APIErrorResponse[dto.GetUserRequest](ctx, "USER_NOT_FOUND", status)
		return
	}

	ctx.JSON(200, util.DefaultAPIResponse[models.UserModel]{
		Success: true,
		Code:    "USER_FETCHED",
		Data:    *user,
	})
}

func (c *Controller) Delete(ctx *gin.Context) {
	uri, ok := util.APIBindUri[dto.GetUserRequest](ctx)

	if !ok {
		util.APIErrorResponse[dto.GetUserRequest](ctx, "INVALID_BODY", http.StatusConflict)
		return
	}

	authId, _ := ctx.Get("authId")

	status := c.UserService.Delete(authId.(string), uri.ID)
	if status == http.StatusForbidden {
		util.APIErrorResponse[dto.GetUserRequest](ctx, "FORBIDDEN", status)
		return
	} else if status == http.StatusNotFound {
		util.APIErrorResponse[dto.GetUserRequest](ctx, "USER_NOT_FOUND", status)
	}

	ctx.JSON(200, util.DefaultAPIResponse[any]{
		Success: true,
		Code:    "DELETED",
	})
}
