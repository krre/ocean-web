import * as category from "./category"
import * as section from "./section"
import * as topic from "./topic"
import * as post from "./post"
import { sendQuery, sendCommand } from "$lib/network";

export import Category = category;
export import Section = section;
export import Topic = topic;
export import Post = post;

export namespace GetAll {
    export interface Section {
        category_id: number;
        id: number;
        name: string;
        topic_count: number;
        post_count: number;
    }

    export interface Category {
        id: number;
        name: string;
        sections?: Section[]
    }

    export interface Response {
        categories: Category[];
        sections: Section[];
    }

    export async function exec(): Promise<Response> {
        return await sendQuery({ method: "forum.getAll" });
    }
}

export namespace GetNew {
    export interface Request {
        limit: number;
        offset: number;
    }

    export interface Topic {
        id: number;
        name: string;
        post_id: number;
        post: string;
        post_count: number;
        post_create_ts: Date;
        user_id: number;
        user_name: string;
    }

    export interface Response {
        topic_count: number;
        topics: Topic[];
    }

    export async function exec(params: Request): Promise<Response> {
        return await sendQuery({ method: "forum.getNew", params });
    }
}
