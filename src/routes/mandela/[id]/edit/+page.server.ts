import type { PageServerLoad } from './$types';
import * as api from "$lib/api";

export const load: PageServerLoad = async ({ params, locals }) => {
    const result = await api.Mandela.GetOne.exec({
        id: +params.id,
    }, locals.session.token);

    const mandela = result.mandela;
    const categories = result.categories;

    return { mandela, categories };
}
