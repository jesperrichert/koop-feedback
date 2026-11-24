package dto

type SessionDto struct {
	ID         uint `json:"id"`
	Code       int  `json:"code"`
	IsStarted  bool `json:"is_started"`
	IsFinished bool `json:"is_finished"`
}

type AddSessionRequest struct {
	HostName string
}

type GetSessionResponse struct {
	Self    UserDto
	Session SessionDto
	Users   []UserDto
}

type JoinSessionRequest struct {
	Code int    `bindings:"required"`
	Name string `bindings:"required"`
}
