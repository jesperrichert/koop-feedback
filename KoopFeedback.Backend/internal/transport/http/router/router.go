package router

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"koopfeedback.de/internal/transport/http/middleware"
	"koopfeedback.de/internal/transport/http/routes/session"
	"koopfeedback.de/internal/transport/http/routes/user"
)

type Config struct {
	DB                *gorm.DB
	API               *gin.Engine
	UserController    *user.Controller
	SessionController *session.Controller
}

func (rc *Config) Setup() {
	userMiddleware := middleware.NewUserMiddleware(rc.DB)
	corsMiddleware := middleware.NewCorsMiddleware()
	rc.API.Use(corsMiddleware.Handle)

	api := rc.API.Group("/api/v2")
	{

		session := api.Group("/session")
		{
			session.POST("", rc.SessionController.CreateSession)
			session.GET("", userMiddleware.Handle, rc.SessionController.GetSession)
			session.POST("/feedback", userMiddleware.Handle, rc.SessionController.PostSessionFeedback) // Add User Feedback for Session
			session.POST("/join", rc.SessionController.JoinSession)
			session.POST("/start", userMiddleware.Handle, rc.SessionController.StartSession)
			session.POST("/end", userMiddleware.Handle, rc.SessionController.EndSession)
		}

		users := api.Group("/user")
		{
			users.GET("/:id", userMiddleware.Handle, rc.UserController.Get)                  // Get User
			users.DELETE("/:id", userMiddleware.Handle, rc.UserController.Delete)            // Remove User from Session
			users.GET("/feedback", userMiddleware.Handle, rc.UserController.GetUserFeedback) // Get User Feedback from Session
			users.DELETE("/logout", userMiddleware.Handle, rc.UserController.Logout)         // Remove User from Session
		}
	}
}
