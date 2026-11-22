package main

import (
	"fmt"

	"koopfeedback.de/internal/config"
)

func main() {
	api := config.NewAPI()
	db := config.NewDatabase()
	config.ConfigureWeb(api)

	appConfig := config.AppConfig{
		DB:  db,
		API: api,
	}
	appConfig.Build()

	err := api.Run("0.0.0.0:3000")
	if err != nil {
		panic(err.Error())
	}
	fmt.Println("Successfully Started Koop-Feedback.")
}
