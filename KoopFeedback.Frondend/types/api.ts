import type {Session} from "./feedback/session";
import type {User} from "./user";

export type DefaultAPIResponse<T> = {
    success: boolean
    code: string
    data: T
}

export type POSTCreateSessionResponseData = {
    authId: string
}

export type POSTSessionFeedbackResponseData = {
    success: number
    failed: number
}

export type GETSessionResponseData = {
    self: User
    session: Session
    users: User[]
}