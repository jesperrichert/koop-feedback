package util

import (
	"context"

	"gorm.io/gorm"
	"koopfeedback.de/internal/models"
)

func GetUserFromAuthId(db *gorm.DB, authId string) *models.User {
	result, _ := gorm.G[models.APIAccess](db).Preload("User", nil).Where("token = ?", authId).First(context.Background())
	return result.User
}
