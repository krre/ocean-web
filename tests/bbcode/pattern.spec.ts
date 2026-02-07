import { txt, rgx, opt, exc, any, seq, rep } from "$lib/bbcode/pattern"
import { describe, test, expect } from "vitest";

describe("BBCode pattern", () => {
    describe("txt", () => {
        test("success", () => {
            expect(txt("abc").exec("abc", 0)).toStrictEqual({ res: "abc", end: 3 });
        })

        test("failure", () => {
            expect(txt("abc").exec("def", 0)).toBe(undefined);
        })
    })

    describe("rgx", () => {
        test("success", () => {
            expect(rgx(/\d+/).exec("123", 0)).toStrictEqual({ res: "123", end: 3 });
        })

        test("failure", () => {
            expect(rgx(/\d+/).exec("abc", 0)).toBe(undefined);
        })
    })

    describe("opt", () => {
        test("success", () => {
            expect(opt(txt("abc")).exec("abc", 0)).toStrictEqual({ res: "abc", end: 3 });
        })

        test("failure", () => {
            expect(opt(txt("abc")).exec("123", 0)).toStrictEqual({ res: undefined, end: 0 });
        })
    })

    describe("exc", () => {
        const p = exc(rgx(/[A-Z]/), txt("H"));

        test("success", () => {
            expect(p.exec("R", 0)).toStrictEqual({ res: "R", end: 1 });
        })

        test("failure", () => {
            expect(p.exec("H", 0)).toBe(false);
        })
    })

    describe("any", () => {
        const p = any(txt("abc"), txt("def"));

        test("success 1", () => {
            expect(p.exec("abc", 0)).toStrictEqual({ res: "abc", end: 3 });
        })

        test("success 2", () => {
            expect(p.exec("def", 0)).toStrictEqual({ res: "def", end: 3 });
        })

        test("failure", () => {
            expect(p.exec("ABC", 0)).toBe(undefined);
        })
    })

    describe("seq", () => {
        const p = seq(txt("abc"), txt("def"));

        test("success", () => {
            expect(p.exec("abcdef", 0)).toStrictEqual({ res: ["abc", "def"], end: 6 });
        })

        test("failure", () => {
            expect(p.exec("abcde7", 0)).toBe(undefined);
        })
    })

    describe("rep", () => {
        const p = rep(rgx(/\d+/), txt(","));

        test("success 1", () => {
            expect(p.exec("1,23,456", 0)).toStrictEqual({ res: ["1", "23", "456"], end: 8 });
        })

        test("success 2", () => {
            expect(p.exec("123ABC", 0)).toStrictEqual({ res: ["123"], end: 3 });
        })

        test("failure", () => {
            expect(p.exec("ABC", 0)).toStrictEqual({ res: [], end: 0 });
        })
    })
});
