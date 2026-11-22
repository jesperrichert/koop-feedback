package models

type Session struct {
	ID         uint `gorm:"primary_key"`
	Code       int
	IsStarted  bool
	IsFinished bool
	Users      []User
}
