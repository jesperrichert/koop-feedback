import type {Feedback} from "./feedback/feedback";
import type {Session} from "./feedback/session";

export interface User {
    CreatedAt: Date
    DeletedAt: Date
    Feedback: Feedback[] | null
    HasSubmitted: false
    ID: number
    IsHost: boolean
    Name: string
    SessionID: number
    Session: Session
    UpdatedAt: Date
    APIAuth: null // Only to mark as null not included in API Requests...
}