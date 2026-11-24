package models

import "koopfeedback.de/internal/types/feedback"

type FeedbackModel struct {
	ID          uint `gorm:"primary_key"`
	Type        feedback.FeedbackType
	Description string
	UserID      int
	User        UserModel `gorm:"foreignkey:UserID"`
}

func (FeedbackModel) TableName() string {
	return "feedback"
}
