package util

import (
	"github.com/gin-gonic/gin"
)

type DefaultAPIResponse[T any] struct {
	Success bool   `json:"success"`
	Code    string `json:"code"`
	Data    T      `json:"data"`
}

func APIErrorResponse[T any](ctx *gin.Context, err string, statusCode int) {
	ctx.JSON(statusCode,
		DefaultAPIResponse[T]{
			Success: false,
			Code:    err,
		})
	return
}

func APIBindBody[T any](ctx *gin.Context) (x *T, y bool) {
	var bind *T

	err := ctx.ShouldBindBodyWithJSON(&bind)
	if err != nil {
		return bind, false
	}

	return bind, true
}

func APIBindUri[T any](ctx *gin.Context) (x *T, y bool) {
	var bind *T

	err := ctx.ShouldBindUri(&bind)
	if err != nil {
		return bind, false
	}
	return bind, true
}
