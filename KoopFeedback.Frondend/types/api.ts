import type {Session} from "./feedback/session";
import type {User} from "./user";

export type DefaultAPIResponse<T> = {
    Success: boolean
    Message: string
    Data: T
}

export type POSTCreateSessionResponseData = {
    authId: string
}

export type POSTSessionFeedbackResponseData = {
    Success: number
    Failed: number
}

export type GETSessionResponseData = {
    Self: User
    Session: Session
    Users: User[]
}