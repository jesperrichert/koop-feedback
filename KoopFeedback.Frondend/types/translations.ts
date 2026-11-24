import type {StickyTone} from "./feedback/sticky-note";

export type MainPageButton = {
    createSession: string;
};

export type MainPageCode = {
    label: string;
    placeholder: string;
    join: string;
};

export type MainPageFooter = {
    imprint: string;
    imprintUrl: string;
    privacy: string;
    privacyUrl: string;
};

export type MainPage = {
    title: string;
    subtitle: string;
    infoMessage: string;
    button: MainPageButton;
    code: MainPageCode;
    footer: MainPageFooter;
    columns: Column[];
    pageError: PageError;
};

export type PageError = {
    message: string;
    details: string;
    error: string;
    back: string;
    text: string
    startPage: string;
    filler: string;
    notFound: {
        text: string;
        message: string;
        details: string;
    }
}

export type ColumnNote = {
    text: string;
    tilt: number;
};

export type Column = {
    title: string;
    tone: StickyTone;
    labelClass: string;
    notes: ColumnNote[];
};

export type CreateSessionName = {
    label: string;
    placeholder: string;
};

export type CreateSessionButton = {
    create: string;
    creating: string;
};

export type CreateSession = {
    title: string;
    subtitle: string;
    name: CreateSessionName;
    button: CreateSessionButton;
};

export type SessionQrCode = {
    title: string;
    subtitle: string;
};

export type SessionButton = {
    start: string;
};

export type Session = {
    qrCode: SessionQrCode;
    participants: string;
    button: SessionButton;
    notFound: SessionNotFound;
};

export type SessionNotFound = {
    title: string;
    description: string;
    back: string;
}

export type RunSessionHeader = {
    sessionCode: string;
    loggedInAs: string;
};

export type RunSessionFeedback = {
    title: string;
    placeholder: string;
};

export type RunSessionButton = {
    submitFeedback: string;
    endSession: string;
    cancel: string;
};

export type RunSession = {
    header: RunSessionHeader;
    participants: string;
    alreadySubmitted: string;
    alreadySubmittedTooltip: string;
    feedbackReady: string;
    feedback: RunSessionFeedback;
    button: RunSessionButton;
};


export type EndSessionButton = {
    logout: string;
};

export type EndSession = {
    title: string;
    noFeedback: string;
    button: EndSessionButton;
};

export type SessionToasts = {
    created: string;
    joined: string;
    started: string;
    ended: string;
    notFound: string;
    creationFailed: string;
    joinFailed: string;
    endFailed: string;
    loadFailed: string;
    invalidCode: string;
    codeCopied: string;
};

export type FeedbackToasts = {
    submitted: string;
    noFeedbackSubmitted: string;
    itemsSubmitted: string;
    notFound: string;
    submissionFailed: string;
    added: string;
    removed: string;
    loadFailed: string;
};


export type ValidationToasts = {
    nameRequired: string;
    descriptionRequired: string;
};

export type Toasts = {
    session: SessionToasts;
    feedback: FeedbackToasts;
    validation: ValidationToasts;
};

export interface Translations {
    mainPage: MainPage;
    session: Session;
    createSession: CreateSession;
    runSession: RunSession;
    endSession: EndSession;
    toasts: Toasts;
}
