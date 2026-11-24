package models

import "koopfeedback.de/internal/dto"

type SessionModel struct {
	ID         uint `gorm:"primary_key"`
	Code       int
	IsStarted  bool
	IsFinished bool
	Users      []UserModel
}

func (SessionModel) TableName() string {
	return "sessions"
}

func (u *SessionModel) ToDto() dto.SessionDto {
	return dto.SessionDto{
		ID:         u.ID,
		Code:       u.Code,
		IsStarted:  u.IsStarted,
		IsFinished: u.IsFinished,
	}
}
