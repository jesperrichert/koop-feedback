package models

type APIAccessModel struct {
	ID     uint `gorm:"primary_key"`
	Token  string
	UserID int
	User   *UserModel `gorm:"foreignkey:UserID"`
}

func (APIAccessModel) TableName() string {
	return "api_access"
}
