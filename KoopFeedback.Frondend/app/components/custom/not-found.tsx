import {Link} from "react-router";
import {ArrowLeft, SearchX} from "lucide-react";
import {Button} from "~/components/ui/button";
import {useTranslation} from "~/context/translation";

export function NotFound() {
    const {translations} = useTranslation();
    return (
        <div
            className="h-screen flex items-center justify-center bg-white">
            <div
                className={"mx-auto flex items-center justify-center max-w-md flex-col gap-6 rounded-[28px] border border-[#E2E6F2] bg-white p-8 text-[#14162B] shadow-[0_24px_48px_-16px_rgba(67,56,202,0.22)]"}>
                <div className="flex items-center gap-4">
                    <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                        <SearchX className="h-7 w-7" aria-hidden="true"/>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="font-display text-2xl font-extrabold tracking-tight">
                            {translations?.session.notFound.title}
                        </h2>
                    </div>
                </div>

                <p className="leading-relaxed text-[#4A4F68]">
                    {translations?.session.notFound.description}
                </p>

                <Button
                    asChild
                    className="h-14 w-full cursor-pointer rounded-2xl bg-indigo-700 text-base font-semibold hover:bg-indigo-800"
                >
                    <a href={"/"}>
                        <ArrowLeft className="mr-2 h-5 w-5" aria-hidden="true"/>
                        {translations?.session.notFound.back}
                    </a>
                </Button>
            </div>
        </div>
    );
}