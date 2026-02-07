import { name, char, wsp, text, quoted, attr, attrs, open, close, node, doc } from "$lib/bbcode/parser"

import { describe, test, expect } from "vitest";

describe("BBCode parser", () => {
    test("name", () => {
        expect(name.exec("Width", 0)).toStrictEqual({ res: "width", end: 5 })
    });

    test("char", () => {
        expect(char.exec("x", 0)).toStrictEqual({ res: "x", end: 1 })
    });

    test("wsp", () => {
        expect(wsp.exec("  ", 0)).toStrictEqual({ res: "  ", end: 2 })
    });

    test("text", () => {
        expect(text.exec("w3$u", 0)).toStrictEqual({ res: "w3$u", end: 4 })
    });

    test("quoted", () => {
        expect(quoted.exec('"400"', 0)).toStrictEqual({ res: "400", end: 5 })
    });

    test("attr", () => {
        expect(attr.exec('width="500"', 0)).toStrictEqual({ res: { name: "width", value: "500" }, end: 11 })
    });

    test("attrs", () => {
        expect(attrs.exec('width="500" height="200"', 0)).toStrictEqual({ res: { width: "500", height: "200" }, end: 24 })
    });

    test("open", () => {
        expect(open.exec('⁅b⁆', 0)).toStrictEqual({ res: { name: "b", attrs: {} }, end: 3 })
    });

    test("open attr", () => {
        expect(open.exec('⁅url="https://ocean-mandela.info"⁆', 0)).toStrictEqual({ res: { name: "url", attrs: { url: "https://ocean-mandela.info" } }, end: 34 })
    });

    test("open attrs", () => {
        expect(open.exec('⁅img width="500" height="200"⁆', 0)).toStrictEqual({ res: { name: "img", attrs: { width: "500", height: "200" } }, end: 30 })
    });

    test("close", () => {
        expect(close.exec('⁅/b⁆', 0)).toStrictEqual({ res: "b", end: 4 })
    });

    test("node bbcode", () => {
        expect(node.exec('⁅b⁆bold text⁅/b⁆', 0)).toStrictEqual({ res: { name: "b", attrs: {}, nodes: ["bold text"] }, end: 16 })
    });

    test("nodes", () => {
        expect(node.exec('⁅b⁆⁅i⁆bold italic text⁅/i⁆ bold text⁅/b⁆', 0)).toStrictEqual({
            res: {
                name: "b", attrs: {}, nodes:
                    [{
                        name: "i", attrs: {}, nodes: [
                            "bold italic text"
                        ],
                    }, " bold text"]
            }, end: 40
        })
    });

    test("doc", () => {
        expect(doc.exec("Simple text", 0)).toStrictEqual({ res: { name: "doc", attrs: {}, nodes: ["Simple text"] }, end: 11 })
    });
})
