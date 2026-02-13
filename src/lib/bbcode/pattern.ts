const IS_DEBUG = false;

export interface PatternResult<T> {
    res: T,
    end: number
}

type ExecFn<T> = (str: string, pos: number) => PatternResult<T> | undefined;

export class Pattern<T = any> {
    constructor(public name: string, exec: ExecFn<T>) {
        if (IS_DEBUG) {
            this.exec = (str: string, pos: number) => {
                console.debug(`Exec ${name}: str: ${str}, pos: ${pos}`);
                const result = exec(str, pos);
                console.debug(`Result ${name}:`, result);
                return result;
            };
        } else {
            this.exec = exec;
        }
    }

    exec: ExecFn<T>;

    then<U>(transform: (arg: T) => U): Pattern<U> {
        return new Pattern(this.name, (str, pos) => {
            const r = this.exec(str, pos);
            return r ? { res: transform(r.res), end: r.end } : undefined;
        });
    }
}

export function txt(text: string): Pattern<string> {
    return new Pattern("txt", (str, pos) => {
        if (str.substring(pos, pos + text.length) == text) {
            return { res: text, end: pos + text.length }
        }
    });
}

export function rgx(regexp: RegExp): Pattern<string> {
    return new Pattern("rgx", (str, pos) => {
        const m = regexp.exec(str.slice(pos));

        if (m && m.index == 0) {
            return { res: m[0], end: pos + m[0].length }
        }
    });
}

export function opt<T>(pattern: Pattern<T>): Pattern<T | undefined> {
    return new Pattern<T | undefined>("opt", (str, pos) =>
        pattern.exec(str, pos) ?? {
            res: undefined, end: pos,
        });
}

export function exc<T>(pattern: Pattern<T>, except: Pattern<T>): Pattern<T | undefined> {
    return new Pattern<T | undefined>("exc", (str, pos) => {
        return !except.exec(str, pos) ? pattern.exec(str, pos) : undefined;
    });
}

export function any<T>(...patterns: Pattern<T>[]): Pattern<T | undefined> {
    return new Pattern("any", (str, pos) => {
        for (const pattern of patterns) {
            const r = pattern.exec(str, pos);

            if (r && r.res) {
                return r;
            }
        }
    });
}

export function seq<T extends any[]>(...patterns: Pattern<any>[]): Pattern<T> {
    return new Pattern<T>("seq", (str, pos) => {
        let res = [];
        let end = pos;

        for (const pattern of patterns) {
            let r = pattern.exec(str, end);

            if (!r) return;

            res.push(r.res);
            end = r.end;
        }

        return { res: res as T, end: end };
    });
}

export function rep<T>(pattern: Pattern<T>, separator?: Pattern<any>): Pattern<T[]> {
    const separated = !separator ? pattern : seq(separator, pattern).then(r => r[1]);

    return new Pattern<T[]>("rep", (str: string, pos: number) => {
        const res = [];
        let end = pos;
        let r = pattern.exec(str, end);

        while (r && r.end > end) {
            res.push(r.res);
            end = r.end;
            r = separated.exec(str, end);
        }

        return { res: res, end: end }
    })
}
