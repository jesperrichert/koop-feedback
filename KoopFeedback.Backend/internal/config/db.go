package config

import (
	"os"

	"koopfeedback.de/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func NewDatabase() *gorm.DB {

	// os.Getenv("DATABASE_URL")
	connStr, ok := os.LookupEnv("DATABASE_URL")
	if !ok {
		panic("DATABASE_URL environment variable not set")
	}
	db, dbErr := gorm.Open(postgres.Open(connStr), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if dbErr != nil {
		panic("Failed to connect to database.")
	}

	// Migrate the schema
	dbMigrateErr := db.AutoMigrate(&models.APIAccessModel{}, &models.UserModel{}, &models.FeedbackModel{}, &models.SessionModel{})

	if dbMigrateErr != nil {
		panic("Failed to migrate the database...")
	}

	return db
}
