export type FeedbackDto = {
    user_id: number;
    type: FeedbackType;
    description: string;
}

export enum FeedbackType {
    Normal = 0,
    Positive = 1
}