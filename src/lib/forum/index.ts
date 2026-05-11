import * as route from '$lib/route';
import * as consts from '$lib/consts';

export interface PathPart {
	id?: number;
	name: string;
	route?: string;
}

export interface NewTopic {
	id: number;
	name: string;
	post: string;
	post_id: number;
	post_count: number;
	post_create_ts: Date;
	user_id: number;
	user_name: string;
}

export function topicLink(topicId: number, postCount: number): string {
	const offset = Math.floor(postCount / consts.Forum.Post.PageLimit);
	const query = offset ? `?page=${offset + 1}` : '';
	return route.Forum.Topic.Id(topicId) + query;
}
