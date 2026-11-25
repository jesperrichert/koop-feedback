package models

import "koopfeedback.de/internal/types/feedback"

type FeedbackModel struct {
	ID          uint `gorm:"primaryKey"`
	Type        feedback.FeedbackType
	Description string
	UserID      uint
	User        UserModel
}

func (FeedbackModel) TableName() string {
	return "feedback"
}
