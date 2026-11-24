package cron

import (
	"context"
	"fmt"
	"time"

	"koopfeedback.de/internal/models"

	"github.com/go-co-op/gocron/v2"
	"gorm.io/gorm"
)

type CronConfig struct {
	DB *gorm.DB
}

func NewCron(db *gorm.DB) *CronConfig {
	return &CronConfig{
		DB: db,
	}
}

func (c *CronConfig) Setup() {

	s, err := gocron.NewScheduler()
	if err != nil {
		fmt.Println("Failed to schedule... " + err.Error())
	}

	j, err := s.NewJob(
		gocron.DurationJob(
			24*time.Hour,
		),
		gocron.NewTask(
			func() {
				fmt.Println("Running Job for Database Cleanup....")
				sessions, err := gorm.G[models.SessionModel](c.DB).Where("is_finished = ?", true).Preload("Users", nil).Find(context.Background())

				if err != nil {
					fmt.Println("Cleanup failed with err " + err.Error())
					return
				}

				for i := range sessions {
					session := sessions[i]

					for u := range session.Users {
						user := session.Users[u]

						dbUser, _ := gorm.G[models.UserModel](c.DB).Where("id = ?", user.ID).Preload("APIAuth", nil).Preload("Feedback", nil).First(context.Background())

						if len(dbUser.Feedback) > 0 {
							c.DB.Delete(&dbUser.Feedback)
						}
						c.DB.Delete(&dbUser.APIAuth)
						c.DB.Delete(&dbUser)
					}

					c.DB.Delete(&sessions)
				}

				fmt.Println("Cleanup done...")
			},
		),
	)
	if err != nil {
		fmt.Println("Failed to start... " + err.Error())
	}
	fmt.Println("Started Job with ID " + j.ID().String())

	s.Start()

	fmt.Println("Job is running every 24h")
}
