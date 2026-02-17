import type { LayoutLoad } from './$types';
import { setSession } from '$lib/stores';
import { browser } from '$app/environment';

export const load: LayoutLoad = async ({ data }) => {
	if (browser) {
		setSession(data.session)
	}

	return { session: data.session }
};
