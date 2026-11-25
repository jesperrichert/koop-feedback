import type {FeedbackDto} from "./feedback/feedbackDto";
import type {SessionDto} from "./feedback/sessionDto";

export type UserDto = {
    feedback: FeedbackDto[] | null
    has_submitted: false
    id: number
    is_host: boolean
    name: string
    session_id: number
    session: SessionDto
}