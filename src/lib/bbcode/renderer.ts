export function render(node: any): string {
    let result = "";

    node.nodes.forEach(n => {
        if (typeof n === "object") {
            result += render(n);
        } else {
            result += n
        }
    });

    return renderBBCode(node.name, result, node.attrs);
}

function renderBBCode(name: string, value: string, attrs: any): string {
    switch (name) {
        case "b": return `<strong>${value}</strong>`;
        case "i": return `<em>${value}</em>`;
        case "u": return `<ins>${value}</ins>`;
        case "s": return `<del>${value}</del>`;
        case "url": return `<a href="${attrs.url || value}">${value}</a>`;
        case "img": return `<a href="${value}"><img src="${value}"${attrs.width ? " width=" + attrs.width : ""}></a>`;
        case "youtube": return youtube(value);
        case "spoiler": return `<details><summary>${attrs.spoiler}</summary><br />${value}</details>`;
        case "quote": return `<div class="quote">${attrs.quote} пишет:<br/><br/><em>${value}</em></div>`;
    }

    return value;
}

function youtube(value: string): string {
    const match = value.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v?))\=?([^#&?]*)(?:(\?t|&start)=(\d+))?.*/)
    const id = match ? match[7] : 0
    const time = (match && match[9]) ? "?start=" + match[9] : ""
    return `<iframe class="video" src="https://www.youtube.com/embed/${id}${time}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
}
