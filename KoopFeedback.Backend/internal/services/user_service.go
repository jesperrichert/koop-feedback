package services

import (
	"context"
	"net/http"

	"gorm.io/gorm"
	"koopfeedback.de/internal/models"
	"koopfeedback.de/internal/util"
)

type UserService struct {
	DB *gorm.DB
}

func NewUserService(db *gorm.DB) *UserService {
	return &UserService{
		DB: db,
	}
}

func (s *UserService) GetFeedback(authId int) ([]models.FeedbackModel, int) {
	apiAccess, err := gorm.G[models.APIAccessModel](s.DB).Preload("User", nil).Where("token = ?", authId).First(context.Background())
	user, _ := gorm.G[models.UserModel](s.DB).Preload("Session", nil).Preload("Feedback", nil).Where("id = ?", apiAccess.User.ID).First(context.Background())
	if err != nil {
		return nil, http.StatusInternalServerError
	}

	if len(user.Feedback) <= 0 {
		return nil, http.StatusNoContent
	}
	if !user.Session.IsStarted || !user.Session.IsFinished {
		return nil, http.StatusLocked
	}

	var filteredFeedback []models.FeedbackModel
	for i := range len(user.Feedback) {
		f := user.Feedback[i]
		filteredFeedback = append(filteredFeedback, models.FeedbackModel{
			Type:        f.Type,
			Description: f.Description,
		})

	}

	return filteredFeedback, http.StatusOK
}

func (s *UserService) Delete(authId string, otherUserId int) int {
	isSelf := util.IsSameUser(s.DB, authId, otherUserId)
	isHost := util.IsUserHostByUserId(s.DB, otherUserId)
	actingUser := util.GetUserFromAuthId(s.DB, authId)

	if isSelf || isHost || !actingUser.IsHost {
		return http.StatusForbidden
	}

	user, err := gorm.G[models.UserModel](s.DB).Preload("APIAuth", nil).Where("id = ?", otherUserId).First(context.Background())
	if err != nil {
		return http.StatusNotFound
	}

	s.DB.Delete(&user.APIAuth)
	s.DB.Delete(&user)

	return http.StatusOK
}

func (s *UserService) Get(userId int) (*models.UserModel, int) {
	user, err := gorm.G[models.UserModel](s.DB).Preload("Session", nil).Where("id = ?", userId).First(context.Background())
	if err != nil {
		return nil, http.StatusNotFound
	}
	return &user, http.StatusOK
}

func (s *UserService) Logout(userId int) int {
	user, err := gorm.G[models.UserModel](s.DB).Preload("Feedback", nil).Where("id = ?", userId).First(context.Background())
	if err != nil {
		return http.StatusInternalServerError
	}

	s.DB.Delete(&user.Feedback)

	return http.StatusOK
}
