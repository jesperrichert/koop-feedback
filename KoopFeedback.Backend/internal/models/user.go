package models

type User struct {
	ID           uint `gorm:"primary_key"`
	Name         string
	HasSubmitted bool
	IsHost       bool
	Feedback     []FeedbackModel
	APIAuth      *APIAccess
	SessionID    int
	Session      Session
}
