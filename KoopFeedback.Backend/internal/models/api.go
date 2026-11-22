package models

type APIAccess struct {
	ID     uint `gorm:"primary_key"`
	Token  string
	UserID int
	User   *User
}
