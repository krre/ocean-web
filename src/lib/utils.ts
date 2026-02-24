import * as consts from "$lib/consts";
import type { MandelaTitle } from "$lib/types"
import sha1 from "sha1";
import { PUBLIC_ANONYM_ALLOWED } from '$env/static/public';

export function formatDateTime(date: Date): string {
    return formatDate(date) + " " + formatTime(date);
}

export function formatDate(date: Date): string {
    const d = new Date(date);
    return ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." + d.getFullYear();
}

export function formatTime(date: Date): string {
    const d = new Date(date);
    return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
}

export function zeroLeading(value: number, digits: number): string {
    return value.toString().padStart(digits, "0");
}

export function makeTitle(mandela: MandelaTitle): string {
    return mandela.title_mode === consts.Mandela.Title.Simple ? mandela.title :
        mandela.what + ": " + mandela.before + " / " + mandela.after;
}

export function createToken(id: number, password: string): string {
    return sha1(id.toString() + password) as string;
}

export function textCut(text: string, count: number): string {
    return text.length <= count ? text : text.substring(0, count) + "..."
}

export function insertText(source: string, position: number, text: string): string {
    return source.substring(0, position) + text + source.substring(position);
}

export function userUrl(name: string, id: number) {
    return `<a href="/user/${id}">${name}</a>`
}

export function pageUrl(baseUrl: string, title: string, id: number, page: number, blank?: boolean) {
    const blankCode = blank ? 'target="_blank"' : "";
    return `<a ${blankCode} href="${baseUrl}${page > 1 ? "?page=" + page : ""}#${id}">${title}</a>`
}

export function dateUrl(baseUrl: string, date: Date, id: number, page: number) {
    return pageUrl(baseUrl, formatDateTime(date), id, page)
}

export function isAnonymAllowed(): boolean {
    return PUBLIC_ANONYM_ALLOWED === "1"
}
