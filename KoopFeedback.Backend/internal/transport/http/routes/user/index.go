package user

import (
	"net/http"

	"koopfeedback.de/internal/models"
	"koopfeedback.de/internal/util"

	"github.com/gin-gonic/gin"
)

type GETUser struct {
	ID int `uri:"id" bindings:"required"`
}

func (c *Controller) Get(ctx *gin.Context) {
	uri, hasBody := util.APIBindUri[GETUser](ctx)

	if !hasBody {
		util.APIErrorResponse[GETUser](ctx, "INVALID_BODY", http.StatusConflict)
		return
	}

	user, status := c.UserService.Get(uri.ID)
	if status != http.StatusOK {
		util.APIErrorResponse[GETUser](ctx, "USER_NOT_FOUND", status)
		return
	}

	ctx.JSON(200, util.DefaultAPIResponse[models.User]{
		Success: true,
		Message: "USER_FETCHED",
		Data:    *user,
	})
}

func (c *Controller) Delete(ctx *gin.Context) {
	uri, ok := util.APIBindUri[GETUser](ctx)

	if !ok {
		util.APIErrorResponse[GETUser](ctx, "INVALID_BODY", http.StatusConflict)
		return
	}

	authId, _ := ctx.Get("authId")

	status := c.UserService.Delete(authId.(string), uri.ID)
	if status == http.StatusForbidden {
		util.APIErrorResponse[GETUser](ctx, "FORBIDDEN", status)
		return
	} else if status == http.StatusNotFound {
		util.APIErrorResponse[GETUser](ctx, "USER_NOT_FOUND", status)
	}

	ctx.JSON(200, util.DefaultAPIResponse[any]{
		Success: true,
		Message: "DELETED",
	})
}
