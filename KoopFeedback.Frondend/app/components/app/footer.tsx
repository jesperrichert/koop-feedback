import {useTranslation} from "~/context/translation";

const linkClass =
    "inline-flex min-h-11 items-center text-[#5B6078] transition-colors hover:text-[#14162B]";

export default function Footer() {
    const {translations} = useTranslation();

    return (
        <footer className="w-full">
            <div
                className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 border-t border-[#E2E6F2] px-8 pb-8 pt-6 text-sm md:flex-row">
                <p className="text-[#5B6078]">
                    © 2026{" "}
                    <a
                        href="https://jespersen.zip"
                        className="font-medium text-[#14162B] underline-offset-4 hover:underline"
                    >
                        jespersen.zip
                    </a>
                    . All rights reserved.
                </p>

                <div className="flex items-center gap-5">
                    <a
                        href={translations?.mainPage.footer.privacyUrl}
                        className={linkClass}
                    >
                        {translations?.mainPage.footer.privacy}
                    </a>
                    <a
                        href={translations?.mainPage.footer.imprintUrl}
                        className={linkClass}
                    >
                        {translations?.mainPage.footer.imprint}
                    </a>
                    <a
                        href="https://github.com/jesperrichert/koop-feedback"
                        className={`${linkClass} justify-center`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                    >
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    );
}