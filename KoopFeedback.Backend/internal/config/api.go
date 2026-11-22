package config

import "github.com/gin-gonic/gin"

func NewAPI() *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()
	return router
}
