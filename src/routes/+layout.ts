import type { LayoutLoad } from './$types';
import { setToken } from "$lib/network";

export const load: LayoutLoad = async ({ params }) => {
	// setToken(session.user ? session.user.token : "");
	setToken("")
};
