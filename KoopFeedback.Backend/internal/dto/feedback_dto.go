package dto

import (
	"koopfeedback.de/internal/types/feedback"
)

type FeedbackDto struct {
	UserId      uint                  `json:"user_id"`
	Type        feedback.FeedbackType `json:"type"`
	Description string                `json:"description"`
}

type AddFeedbackRequest struct {
	Feedback []FeedbackDto `json:"feedback"`
}

type AddFeedbackResponse struct {
	Success int `json:"success"`
	Failed  int `json:"failed"`
}
