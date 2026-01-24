import * as api from "$lib/api";
import type { Session, Page } from "$lib/types";
import { createToken } from "$lib/utils";

export async function preload(_page: Page, session: Session) {
    const params: api.User.GetOne.Request = {
        id: +session.user.id,
    };

    const user = await api.User.GetOne.exec(params);
    return { user };
}
