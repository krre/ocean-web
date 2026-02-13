import type { LayoutLoad } from './$types';
import { setSession } from '$lib/stores';
import { browser } from '$app/environment';

export const load: LayoutLoad = async ({ data }) => {
	if (browser) {
		console.log("set session", JSON.stringify(data.session), browser);
		setSession(data.session)
	}

	return { session: data.session }
};
