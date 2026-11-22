package config

import (
	"koopfeedback.de/internal/cron"
	"koopfeedback.de/internal/transport/http/router"
	"koopfeedback.de/internal/transport/http/routes/session"
	"koopfeedback.de/internal/transport/http/routes/user"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AppConfig struct {
	DB  *gorm.DB
	API *gin.Engine
}

func (c *AppConfig) Build() {

	// Services
	// .

	// CronJob
	cron.NewCron(c.DB)

	// Contoller
	userController := user.NewController(c.DB)
	sessionController := session.NewController(c.DB)

	// Router
	routerConfig := router.Config{
		DB:                c.DB,
		API:               c.API,
		UserController:    userController,
		SessionController: sessionController,
	}
	routerConfig.Setup()

}
