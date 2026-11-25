package dto

type UserDto struct {
	ID           string        `json:"id"`
	Name         string        `json:"name"`
	HasSubmitted bool          `json:"has_submitted"`
	IsHost       bool          `json:"is_host"`
	Feedback     []FeedbackDto `json:"feedback"`
	Session      SessionDto    `json:"session"`
}

type GetUserRequest struct {
	ID uint `uri:"id" bindings:"required"`
}
