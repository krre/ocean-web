import type { PageServerLoad } from './$types';
import * as api from "$lib/api";

export const load: PageServerLoad = async ({ params }) => {
    const result = await api.Mandela.GetOne.exec({
        id: +params.id,
    });

    const mandela = result.mandela;
    const categories = result.categories;

    return { mandela, categories };
}
