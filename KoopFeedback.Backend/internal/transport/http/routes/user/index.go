package user

import (
	"context"
	"net/http"

	"koopfeedback.de/internal/models"
	util2 "koopfeedback.de/internal/util"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type GETUser struct {
	ID int `uri:"id" bindings:"required"`
}

func (c *Controller) GetUser(ctx *gin.Context) {
	bCtx := context.Background()
	body, hasBody := util2.APIBindUri[GETUser](ctx)

	if !hasBody {
		util2.APIErrorResponse[GETUser](ctx, "INVALID_BODY", http.StatusConflict)
		return
	}

	user, err := gorm.G[models.User](c.DB).Preload("Session", nil).Where("id = ?", body.ID).First(bCtx)

	if err != nil {
		util2.APIErrorResponse[GETUser](ctx, err.Error(), http.StatusInternalServerError)
		return
	}

	ctx.JSON(200, util2.DefaultAPIResponse[models.User]{
		Success: true,
		Message: "User",
		Data:    user,
	})
	return
}

func (c *Controller) DeleteUser(ctx *gin.Context) {
	bCtx := context.Background()
	body, hasBody := util2.APIBindUri[GETUser](ctx)

	if !hasBody {
		util2.APIErrorResponse[GETUser](ctx, "INVALID_BODY", http.StatusConflict)
		return
	}

	authId, _ := ctx.Get("authId")
	userId, _ := ctx.Get("userId")
	isSelf := util2.DBCheckSelf(c.DB, authId.(string), body.ID)
	isHost := util2.DBCheckHostWithId(c.DB, userId.(int))

	if isSelf {
		util2.APISelfError(ctx)
		return
	}
	if !isHost {
		util2.APIHostError(ctx)
		return
	}

	user, err := gorm.G[models.User](c.DB).Preload("APIAuth", nil).Where("id = ?", body.ID).First(bCtx)
	if err != nil {
		util2.APIErrorResponse[GETUser](ctx, err.Error(), http.StatusInternalServerError)
		return
	}
	c.DB.Delete(&user.APIAuth)
	c.DB.Delete(&user)
	ctx.JSON(200, util2.DefaultAPIResponse[any]{
		Success: true,
		Message: "DELETED",
	})
	return
}
