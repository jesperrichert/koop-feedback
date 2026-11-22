import type {Translations} from "../../types/translations";

export function getLanguageKey(): string {
    const languageKey = document.cookie
        .split("; ")
        .find((row) => row.startsWith("language="))
        ?.split("=")[1]
    return languageKey || "en";
}

export async function getLanguageFile(
    key: string,
) {
    return await fetch(`/language/${key}.json`).then((r) => r.json()).then((r: Translations) => r);
}