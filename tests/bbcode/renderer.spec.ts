import { render } from "$lib/bbcode/renderer"
import { describe, test, expect } from "vitest";

describe("BBCode renderer", () => {
    test("bold", () => {
        expect(render({ name: "b", attrs: {}, nodes: ["bold text"] })).toBe("<strong>bold text</strong>");
    });

    test("italic", () => {
        expect(render({ name: "i", attrs: {}, nodes: ["italic text"] })).toBe("<em>italic text</em>");
    });

    test("underline", () => {
        expect(render({ name: "u", attrs: {}, nodes: ["underline text"] })).toBe("<ins>underline text</ins>");
    });

    test("strikethrough", () => {
        expect(render({ name: "s", attrs: {}, nodes: ["strikethrough text"] })).toBe("<del>strikethrough text</del>");
    });

    test("url", () => {
        expect(render({ name: "url", attrs: {}, nodes: ["https://ocean-mandela.info"] })).toBe(`<a href="https://ocean-mandela.info">https://ocean-mandela.info</a>`);
    });

    test("url description", () => {
        expect(render({ name: "url", attrs: { url: "https://ocean-mandela.info" }, nodes: ["Ocean"] })).toBe(`<a href="https://ocean-mandela.info">Ocean</a>`);
    });

    test("img", () => {
        expect(render({ name: "img", attrs: {}, nodes: ["https://ocean-mandela.info/cat.jpg"] }))
            .toBe(`<a href="https://ocean-mandela.info/cat.jpg"><img src="https://ocean-mandela.info/cat.jpg"></a>`);
    });

    test("img width", () => {
        expect(render({ name: "img", attrs: { width: "500" }, nodes: ["https://ocean-mandela.info/cat.jpg"] }))
            .toBe(`<a href="https://ocean-mandela.info/cat.jpg"><img src="https://ocean-mandela.info/cat.jpg" width=500></a>`);
    });

    test("youtube", () => {
        expect(render({ name: "youtube", attrs: {}, nodes: ["https://youtu.be/GnFq03_3S0c"] }))
            .toBe(`<iframe class="video" src="https://www.youtube.com/embed/GnFq03_3S0c" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
    });

    test("spoiler description", () => {
        expect(render({ name: "spoiler", attrs: { spoiler: "Спойлер" }, nodes: ["Скрытый текст"] })).toBe(`<details><summary>Спойлер</summary><br />Скрытый текст</details>`);
    });

    test("quote", () => {
        expect(render({ name: "quote", attrs: { quote: "Anonym" }, nodes: ["Message"] }))
            .toBe(`<div class="quote">Anonym пишет:<br/><br/><em>Message</em></div>`);
    });

    test("complex", () => {
        expect(render({
            name: "b", attrs: {}, nodes:
                [{
                    name: "i", attrs: {}, nodes: [
                        "bold italic text"
                    ],
                }, " bold text"]
        })).toBe("<strong><em>bold italic text</em> bold text</strong>");
    })
})
