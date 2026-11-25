package models

type APIAccessModel struct {
	ID     uint `gorm:"primaryKey"`
	Token  string
	UserID uint
	User   *UserModel `gorm:"foreignKey:UserID"`
}

func (APIAccessModel) TableName() string {
	return "api_access"
}
