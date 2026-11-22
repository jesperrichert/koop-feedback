package config

import (
	"os"

	"github.com/gin-gonic/gin"
)

func ConfigureWeb(engine *gin.Engine) {
	engine.Static("/assets", os.Getenv("FRONTEND_BUILD")+"/client/assets")
	engine.Static("/language", os.Getenv("FRONTEND_BUILD")+"/client/language")
	engine.StaticFile("/", os.Getenv("FRONTEND_BUILD")+"/client/index.html")
	engine.StaticFile("/icon.svg", os.Getenv("FRONTEND_BUILD")+"/client/icon.svg")

	engine.NoRoute(func(c *gin.Context) {
		c.File(os.Getenv("FRONTEND_BUILD") + "/client/index.html")
	})
}
