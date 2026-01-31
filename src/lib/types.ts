export enum ScreenSize {
    Phone = 600,
    Tablet = 768,
    Desktop = 992,
    LargeDesktop = 1200,
}

export interface User {
    id: number;
    code: string;
    name: string;
    gender: number;
    blocked: boolean;
    token: string;
    create_ts: any;
}

export interface UserSession {
    id: number;
    code: string;
    name: string;
    token: string;
    isAdmin: boolean;
    isAnonym: boolean;
}

export interface Input {
    focus(): void;
}

export interface TextArea {
    selectionStart: number;
    selectionEnd: number;
    value: string;
    focus(): void;
}

export interface Session {
    user: User;
}

export interface Page {
    params: any;
    query: any;
    host: string;
    path: string;
}

export interface ActivityMessage {
    id: number;
    title: string;
    userName: string;
    userId: number;
    date: Date;
    message: string;
    baseUrl: string;
    pageNo: number;
}

export interface MandelaTitle {
    title_mode: number,
    title: string,
    what: string,
    before: string,
    after: string
}

export interface ForumTopicPoll {
    id: number;
    answer: string;
    count: number;
    voted: boolean;
}

// Save non-reactive flag
export class Mounted {
    private _done = false;

    setDone() {
        this._done = true;
    }

    done() {
        return this._done;
    }
}

export enum ForumTopicType {
    Common,
    Poll
}

export enum ForumPollAnswerSelection {
    One,
    Several
}

export enum MandelaVote {
    Yes,
    No,
    Abstain
}

export enum RatingType {
    Mandels,
    Users,
}

export enum Vote {
    Yes,
    No,
    Neutral,
    Fake
}

export enum Gender {
    Male,
    Female,
    Unknown
}

export enum LikeSelection {
    Disabled,
    None,
    Like,
    Dislike
}

export enum LikeAction {
    Like,
    Dislike,
    Unlike
}
