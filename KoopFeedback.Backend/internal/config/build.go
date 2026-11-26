package config

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"koopfeedback.de/internal/cron"
	"koopfeedback.de/internal/services"
	"koopfeedback.de/internal/transport/http/router"
	"koopfeedback.de/internal/transport/http/routes/api/session"
	"koopfeedback.de/internal/transport/http/routes/api/user"
)

type AppConfig struct {
	DB  *gorm.DB
	API *gin.Engine
}

func (c *AppConfig) Build() {

	// Services
	userService := services.NewUserService(c.DB)
	sessionService := services.NewSessionService(c.DB)

	// CronJob
	cron.NewCron(c.DB).Setup()

	// Contoller
	userController := user.NewController(c.DB, userService)
	sessionController := session.NewController(c.DB, sessionService)

	// Router
	routerConfig := router.Config{
		DB:                c.DB,
		API:               c.API,
		UserController:    userController,
		SessionController: sessionController,
	}
	routerConfig.Setup()

}
