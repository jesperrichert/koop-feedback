package session

import (
	"gorm.io/gorm"
	"koopfeedback.de/internal/services"
)

type Controller struct {
	DB             *gorm.DB
	SessionService *services.SessionService
}

func NewController(db *gorm.DB, service *services.SessionService) *Controller {
	return &Controller{
		DB:             db,
		SessionService: service,
	}
}
