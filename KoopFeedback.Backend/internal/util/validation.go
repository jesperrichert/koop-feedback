package util

import (
	"context"

	"koopfeedback.de/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type DefaultAPIResponse[T any] struct {
	Success bool
	Message string
	Data    T
}

func APIErrorResponse[T any](ctx *gin.Context, err string, statusCode int) {
	ctx.JSON(statusCode,
		DefaultAPIResponse[T]{
			Success: false,
			Message: err,
		})
	return
}

func APIBindBody[T any](ctx *gin.Context) (x *T, y bool) {
	var bind *T

	err := ctx.ShouldBindBodyWithJSON(&bind)
	if err != nil {
		return bind, false
	} else {
		return bind, true
	}
}

func APIBindUri[T any](ctx *gin.Context) (x *T, y bool) {
	var bind *T

	err := ctx.ShouldBindUri(&bind)
	if err != nil {
		return bind, false
	}
	return bind, true
}

func IsSameUser(db *gorm.DB, authId string, userId int) (x bool) {
	_, err := gorm.G[models.APIAccess](db).Where("user_id = ? AND token = ?", userId, authId).First(context.Background())

	if err != nil {
		return false
	}
	return true
}

func IsUserHostByUserId(db *gorm.DB, userId int) (x bool) {
	user, err := gorm.G[models.User](db).Where("id = ?", userId).First(context.Background())

	if err != nil || !user.IsHost {
		return false
	}
	return true
}
func DBCheckHostWithAuth(db *gorm.DB, authId string) (x bool) {
	user, err := gorm.G[models.User](db).Where("id = ?", authId).First(context.Background())

	if err != nil || !user.IsHost {
		return false
	}
	return true
}

func DBCheckSameSession(db *gorm.DB, userId string, otherUserId int) (x bool) {
	user1, err1 := gorm.G[models.User](db).Where("id = ?", userId).First(context.Background())
	user2, err2 := gorm.G[models.User](db).Where("id = ?", otherUserId).First(context.Background())

	if err1 != nil || err2 != nil {
		return false
	}
	if user1.SessionID != user2.SessionID {
		return false
	}
	return true
}
