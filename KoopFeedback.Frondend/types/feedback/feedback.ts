export interface Feedback {
    UserId: number
    Type: FeedbackType
    Description: string
}

export enum FeedbackType {
    Normal = 0,
    Positive = 1
}