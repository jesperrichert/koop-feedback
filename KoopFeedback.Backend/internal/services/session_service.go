package services

import (
	"context"
	"fmt"
	"math/rand/v2"
	"net/http"
	"strconv"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"koopfeedback.de/internal/dto"
	"koopfeedback.de/internal/models"
	"koopfeedback.de/internal/types/feedback"
	"koopfeedback.de/internal/util"
)

type SessionService struct {
	DB *gorm.DB
}

func NewSessionService(db *gorm.DB) *SessionService {
	return &SessionService{
		DB: db,
	}
}

func (s *SessionService) Create(hostName string) (string, int) {
	authId := uuid.New().String()
	uniqueCode := false
	code, _ := strconv.Atoi(fmt.Sprintf("%06d", rand.IntN(1_000_000)))
	for !uniqueCode {
		code, _ = strconv.Atoi(fmt.Sprintf("%06d", rand.IntN(1_000_000)))
		sessionModel, err := gorm.G[models.SessionModel](s.DB).Where("code = ?", code).First(context.Background())
		if err != nil && sessionModel.ID == 0 {
			uniqueCode = true
		}
	}

	err := gorm.G[models.UserModel](s.DB).Create(context.Background(), &models.UserModel{
		APIAccess: models.APIAccessModel{
			Token: authId,
		},
		Name:         hostName,
		HasSubmitted: false,
		IsHost:       true,
		Feedback:     nil,
		Session: models.SessionModel{
			Code:       code,
			IsStarted:  false,
			IsFinished: false,
		},
	})

	if err != nil {
		return "", http.StatusInternalServerError
	}

	return authId, http.StatusCreated
}

func (s *SessionService) Get(userId int) ([]models.UserModel, *models.SessionModel, int) {
	user, err := gorm.G[models.UserModel](s.DB).Where("id = ?", userId).First(context.Background())
	if err != nil {
		return nil, nil, http.StatusNotFound
	}

	sessionModel, err := gorm.G[models.SessionModel](s.DB).Where("id = ?", user.SessionID).First(context.Background())
	if err != nil {
		return nil, nil, http.StatusNotFound
	}

	users, err := gorm.G[models.UserModel](s.DB).Where("session_id = ?", sessionModel.ID).Find(context.Background())
	if err != nil {
		return nil, nil, http.StatusBadRequest
	}

	return users, &sessionModel, http.StatusOK
}

func (s *SessionService) Join(code int, name string) (string, int) {
	authId := uuid.New().String()

	sessionModel, err := gorm.G[models.SessionModel](s.DB).Where("code = ?", code).First(context.Background())
	if err != nil {
		return "", http.StatusNotFound
	}
	err = gorm.G[models.UserModel](s.DB).Create(context.Background(), &models.UserModel{
		APIAccess: models.APIAccessModel{
			Token: authId,
		},
		Name:         name,
		HasSubmitted: false,
		IsHost:       false,
		Feedback:     nil,
		SessionID:    sessionModel.ID,
	})
	if err != nil {
		return "", http.StatusInternalServerError
	}

	return authId, http.StatusCreated
}

func (s *SessionService) Start(userId uint) int {
	isHost := util.IsUserHostByUserId(s.DB, userId)
	if !isHost {
		return http.StatusForbidden
	}

	user, err := gorm.G[models.UserModel](s.DB).Preload("Session", nil).Where("id = ?", userId).First(context.Background())
	if err != nil {
		return http.StatusInternalServerError
	}
	sessionModel, err := gorm.G[models.SessionModel](s.DB).Preload("Users", nil).Where("id = ?", user.SessionID).First(context.Background())
	if err != nil {
		return http.StatusInternalServerError
	}

	if len(sessionModel.Users) < 2 {
		return http.StatusConflict
	}
	if user.Session.IsStarted {
		return http.StatusLocked
	}
	if user.Session.IsFinished {
		return http.StatusLocked
	}

	_, err = gorm.G[models.SessionModel](s.DB).Where("id = ?", user.SessionID).Update(context.Background(), "is_started", true)
	if err != nil {
		return http.StatusInternalServerError
	}

	return http.StatusOK
}

func (s *SessionService) AddFeedback(userId int, feedbackDto []dto.FeedbackDto) (int, int) {
	authUser, err := gorm.G[models.UserModel](s.DB).Preload("APIAuth", nil).Preload("Session", nil).Where("id = ?", userId).First(context.Background())

	if !authUser.Session.IsStarted ||
		authUser.Session.IsFinished {
		return 0, http.StatusLocked
	}

	if authUser.HasSubmitted {
		return 0, http.StatusConflict
	}

	if len(feedbackDto) == 0 {
		return 0, http.StatusBadRequest
	}

	successFeedback := 0
	for i := range feedbackDto {
		f := feedbackDto[i]

		isSameSession := util.HasUserSameSession(s.DB, strconv.Itoa(userId), f.UserId)
		isSelf := util.IsSameUser(s.DB, authUser.APIAccess.Token, f.UserId)
		if isSelf ||
			!isSameSession {
			continue
		}
		if f.Type == feedback.Unknown {
			continue
		}
		if len(f.Description) <= 10 {
			continue
		}

		err = gorm.G[models.FeedbackModel](s.DB).Create(context.Background(), &models.FeedbackModel{
			Type:        f.Type,
			Description: f.Description,
			UserID:      f.UserId,
		})

		if err != nil {
			continue
		}
		successFeedback++
	}

	if successFeedback != 0 {
		_, err := gorm.G[models.UserModel](s.DB).Where("id = ?", userId).Update(context.Background(), "has_submitted", true)
		if err != nil {
			return 0, http.StatusInternalServerError
		}
	}

	return successFeedback, http.StatusOK
}

func (s *SessionService) Delete(userId int) int {
	isHost := util.IsUseerHostByAuth(s.DB, strconv.Itoa(userId))
	if !isHost {
		return http.StatusForbidden
	}

	user, err := gorm.G[models.UserModel](s.DB).Preload("Session", nil).Where("id = ?", userId).First(context.Background())
	if err != nil {
		return http.StatusInternalServerError
	}

	if !user.Session.IsStarted ||
		user.Session.IsFinished {
		return http.StatusLocked
	}

	_, err = gorm.G[models.SessionModel](s.DB).Where("id = ?", user.SessionID).Update(context.Background(), "is_finished", true)
	if err != nil {
		return http.StatusInternalServerError
	}

	return http.StatusOK
}
