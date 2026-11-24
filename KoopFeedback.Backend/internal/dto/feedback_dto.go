package dto

import (
	"koopfeedback.de/internal/types/feedback"
)

type FeedbackDto struct {
	UserId      int
	Type        feedback.FeedbackType
	Description string
}

type AddFeedbackRequest struct {
	Feedback []FeedbackDto
}

type AddFeedbackResponse struct {
	Success int
	Failed  int
}
