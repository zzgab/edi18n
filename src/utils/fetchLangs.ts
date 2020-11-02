export type Dict = {[k: string]: string};

export class LangFile {
    public lang: string;
    constructor(
        public url: string,
        public dict: Dict
    ) {
        this.lang = extractLangName(url);
    }
}

export async function fetchFile(url: string): Promise<Dict> {
    const response = await fetch(url);
    return response.json();
}

export function extractLangName(url: string): string {
    const matches = url.match(/([^\\/]+)\.json\??.*$/);
    return (matches && matches[1]) || "";
}