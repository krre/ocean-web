import { modalDialog } from "$lib/stores"

export function open(component, params?: object) {
    modalDialog.set({ component: component, params: params });
}

export function close() {
    modalDialog.set(null);
}
