import type {ReactNode} from "react";

export default function Header({children}: { children?: ReactNode }) {
    return (
        <header className="mx-auto flex w-full max-w-6xl items-center px-8 py-7 gap-2">
            <div className="flex items-center gap-2 mr-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-700">
                    <img
                        src={"/icon.svg"}
                        alt="icon"
                    />
                </div>
                <span className="font-display text-[22px] font-bold tracking-tight text-[#14162B]">
                    Koop Feedback
                </span>
            </div>

            <div className={"gap-3"}>
                {children}
            </div>
        </header>
    );
}