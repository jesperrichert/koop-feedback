import type {UserDto} from "../userDto";

export type SessionDto = {
    code: number
    id: number
    is_finished: boolean
    is_started: boolean
    users: UserDto[]
}