package util

import (
	"context"

	"koopfeedback.de/internal/models"

	"gorm.io/gorm"
)

func IsSameUser(db *gorm.DB, authId string, userId uint) (x bool) {
	_, err := gorm.G[models.APIAccessModel](db).Where("user_id = ? AND token = ?", userId, authId).First(context.Background())

	if err != nil {
		return false
	}
	return true
}

func IsUserHostByUserId(db *gorm.DB, userId uint) (x bool) {
	user, err := gorm.G[models.UserModel](db).Where("id = ?", userId).First(context.Background())

	if err != nil || !user.IsHost {
		return false
	}
	return true
}
func IsUserHostByAuth(db *gorm.DB, authId string) (x bool) {
	apiAccess, err := gorm.G[models.APIAccessModel](db).Preload("User", nil).Where("token = ?", authId).First(context.Background())

	if err != nil || !apiAccess.User.IsHost {
		return false
	}
	return true
}

func HasUserSameSession(db *gorm.DB, userId uint, otherUserId uint) (x bool) {
	user1, err1 := gorm.G[models.UserModel](db).Where("id = ?", userId).First(context.Background())
	user2, err2 := gorm.G[models.UserModel](db).Where("id = ?", otherUserId).First(context.Background())

	if err1 != nil || err2 != nil {
		return false
	}
	if user1.SessionID != user2.SessionID {
		return false
	}
	return true
}

func GetUserFromAuthId(db *gorm.DB, authId string) *models.UserModel {
	result, _ := gorm.G[models.APIAccessModel](db).Preload("User", nil).Where("token = ?", authId).First(context.Background())
	return result.User
}
