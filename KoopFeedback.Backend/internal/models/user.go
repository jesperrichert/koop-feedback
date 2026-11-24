package models

import (
	"strconv"

	"koopfeedback.de/internal/dto"
)

type UserModel struct {
	ID           uint `gorm:"primary_key"`
	Name         string
	HasSubmitted bool
	IsHost       bool
	Feedback     []FeedbackModel
	APIAuth      *APIAccessModel
	SessionID    int
	Session      SessionModel `gorm:"foreignkey:SessionID"`
}

func (UserModel) TableName() string {
	return "users"
}

func (u *UserModel) ToDto() dto.UserDto {
	var feedback []dto.FeedbackDto
	for i := range u.Feedback {
		feedbackModel := u.Feedback[i]
		feedback = append(feedback, dto.FeedbackDto{
			UserId:      feedbackModel.UserID,
			Type:        feedbackModel.Type,
			Description: feedbackModel.Description,
		})
	}

	return dto.UserDto{
		ID:           strconv.Itoa(int(u.ID)),
		Name:         u.Name,
		HasSubmitted: u.HasSubmitted,
		IsHost:       u.IsHost,
		Feedback:     feedback,
		Session: dto.SessionDto{
			ID:         u.Session.ID,
			Code:       u.Session.Code,
			IsStarted:  u.Session.IsStarted,
			IsFinished: u.Session.IsFinished,
		},
	}
}
