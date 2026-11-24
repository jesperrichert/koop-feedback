package user

import (
	"gorm.io/gorm"
	"koopfeedback.de/internal/services"
)

type Controller struct {
	DB          *gorm.DB
	UserService *services.UserService
}

func NewController(db *gorm.DB, service *services.UserService) *Controller {
	return &Controller{
		DB:          db,
		UserService: service,
	}
}
