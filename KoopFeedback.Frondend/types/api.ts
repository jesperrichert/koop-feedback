import type {SessionDto} from "./feedback/sessionDto";
import type {UserDto} from "./userDto";
import type {FeedbackDto} from "./feedback/feedbackDto";

export type DefaultAPIResponse<T> = {
    success: boolean
    code: string
    data: T
}

export type CreateSessionResponse = {
    authId: string
}

export type GetSessionFeedbackResponse = {
    success: number
    failed: number
}

export type GetSessionResponse = {
    self: UserDto
    session: SessionDto
    users: UserDto[]
}

export  type AddFeedbackRequest = {
    feedback: FeedbackDto[]
}