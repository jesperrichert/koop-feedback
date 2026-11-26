import React, {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import {getLanguageFile, getLanguageKey} from "~/lib/language";
import type {Translations} from "../../types/translations/translations";

export type TranslationContextType = {
    translations?: Translations;
    language: string;
}

export const TranslationContext = createContext<TranslationContextType>({} as TranslationContextType)

export function TranslationContextProvider({children}: { children: ReactNode }) {
    const [translations, setTranslations] = useState<Translations>();
    const [language, setLanguage] = useState<string>("en");

    const load = async () => {
        const browserLang = navigator.language.split("-")[0];
        document.cookie = `language=${browserLang}; path=/;`;
        const defaultLang = getLanguageKey();
        setLanguage(defaultLang)
        const translations = await getLanguageFile(defaultLang)
        setTranslations(translations)
    }

    useEffect(() => {
            if (!translations) load();
        }
    )

    return (
        <TranslationContext
            value={{
                translations: translations,
                language: language,
            }}
        >
            {children}
        </TranslationContext>
    )

}

export const useTranslation = () => {
    return useContext(TranslationContext);
};