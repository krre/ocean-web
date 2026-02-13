import { Pattern, txt, rgx, seq, rep, any, opt } from "./pattern"

export interface Node {
    name: string;
    attrs: Record<string, string>;
    nodes: (string | Node)[];
}

export const name = rgx(/[a-z]+/i).then((s: string) => s.toLowerCase());
export const char = rgx(/[^⁅]/i);
export const wsp = rgx(/\s+/);
export const text = rep(char).then(r => r.join(''));
export const quoted = seq(txt('"'), rep(rgx(/[^"]/i)), txt('"')).then(r => r[1].join(''));
export const attr = seq(name, txt("="), quoted).then(r => ({ name: r[0], value: r[2] }));

export const attrs = rep(attr, wsp).then(r => {
    const m: Record<string, string> = {};
    r.forEach(a => (m[a.name] = a.value));
    return m;
});

export const open = seq(txt("⁅"), name, opt(seq(txt("="), quoted)), opt(seq(wsp, attrs)), txt("⁆")).then(r => {
    const result = {
        name: r[1],
        attrs: {} as Record<string, string>
    }

    if (r[2]) {
        result.attrs[result.name] = r[2][1]
    }

    if (r[3]) {
        Object.assign(result.attrs, r[3][1]);
    }

    return result;
});

export const close = seq(txt("⁅/"), name, txt("⁆")).then(r => r[1]);

const subnode = new Pattern<Node>("subnode", (str, pos) => node.exec(str, pos));
export const mix = rep(any<string | Node>(text, subnode));
export const node: Pattern<Node> = seq(open, mix, close).then(r => ({ name: r[0].name, attrs: r[0].attrs, nodes: r[1] }));
export const doc = mix.then(r => ({ name: "doc", attrs: {}, nodes: r } as Node));
