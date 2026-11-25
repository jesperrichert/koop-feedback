package dto

type SessionDto struct {
	ID         uint `json:"id"`
	Code       int  `json:"code"`
	IsStarted  bool `json:"is_started"`
	IsFinished bool `json:"is_finished"`
}

type AddSessionRequest struct {
	HostName string `json:"host_name"`
}

type GetSessionResponse struct {
	Self    UserDto    `json:"self"`
	Session SessionDto `json:"session"`
	Users   []UserDto  `json:"users"`
}

type JoinSessionRequest struct {
	Code int    `bindings:"required"`
	Name string `bindings:"required"`
}
