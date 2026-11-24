package middleware

import (
	"context"
	"net/http"

	"koopfeedback.de/internal/models"
	"koopfeedback.de/internal/util"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type UserMiddleware struct {
	DB *gorm.DB
}

func NewUserMiddleware(db *gorm.DB) *UserMiddleware {
	return &UserMiddleware{
		DB: db,
	}
}

func (m *UserMiddleware) Handle(c *gin.Context) {
	ctx := context.Background()

	authId := c.GetHeader("Authorization")

	if len(authId) == 0 {
		util.APIErrorResponse[any](c, "Unauthorized", http.StatusUnauthorized)
		c.Abort()
		return
	}

	user, err := gorm.G[models.APIAccessModel](m.DB).Where("token = ?", authId).First(ctx)
	if err != nil {
		util.APIErrorResponse[any](c, "Unauthorized - No User", http.StatusUnauthorized)
		c.Abort()
		return
	}

	c.Set("authId", authId)
	c.Set("userId", user.UserID)
	c.Next()
}
