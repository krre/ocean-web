export interface Request<T> {
    method: string;
    id: string;
    params?: T
}

export interface Error {
    code: number;
    message: string;
    data?: any;
}

export interface Response<T> {
    method: string;
    id: string;
    result?: T
    error?: Error
}

export class RequestCreator<T> implements Request<T> {
    method: string;
    id: string;
    params?: T
    private static counter = 0;

    constructor(method: string, params?: T) {
        this.method = method;
        this.params = params;
        this.id = '';
    }

    toString(): string {
        this.id = (RequestCreator.counter++).toString();
        return JSON.stringify(this);
    }
}
