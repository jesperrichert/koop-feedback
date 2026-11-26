import type {ReactNode} from "react";

export default function Header({children}: { children?: ReactNode }) {
    return (
        <header className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-4 sm:px-8 sm:py-7">
            <div className="flex min-w-0 shrink-0 items-center gap-2 sm:mr-10">
                <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-700 sm:h-10 sm:w-10">
                    <img src="/icon.svg" alt="" className="h-5 w-5 sm:h-6 sm:w-6"/>
                </div>
                <span className="font-display truncate text-lg font-bold tracking-tight text-[#14162B] sm:text-[22px]">
                    Koop Feedback
                </span>
            </div>

            <div className="ml-auto flex items-center gap-2 sm:ml-0 sm:gap-3">
                {children}
            </div>
        </header>
    );
}