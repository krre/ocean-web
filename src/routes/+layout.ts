import type { LayoutLoad } from './$types';
import { setSession } from '$lib/stores';

export const load: LayoutLoad = async ({ data }) => {
	setSession(data.session)
};
