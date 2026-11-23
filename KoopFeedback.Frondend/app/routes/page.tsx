import {useContext, useState} from "react";
import {Plus} from "lucide-react";
import {Button} from "~/components/ui/button";
import Header from "~/components/app/header";
import Footer from "~/components/app/footer";
import {Session} from "~/components/custom/state/create/session";
import Join from "~/components/custom/state/create/join";
import {BoardPreview} from "~/components/app/board-preview";
import {TranslationContext} from "~/context/translation";

export function meta({}) {
    return [
        {title: "Koop Feedback"},
        {name: "description", content: "Feedback app for Teams"},
    ];
}

export default function Page() {
    const [showCreateSession, setShowCreateSession] = useState(false);
    const {translations} = useContext(TranslationContext);
    return (
        <div className="flex min-h-screen flex-col bg-[#F4F6FB] text-[#14162B]">
            <Header/>

            <main className="mx-auto flex w-full max-w-6xl flex-grow flex-wrap items-center gap-14 px-8 pb-16 pt-6">
                <section className="flex min-w-0 flex-[1_1_520px] flex-col gap-7">
                    <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tighter sm:text-6xl">
                        {translations?.mainPage.title}
                    </h1>
                    <p className="max-w-md text-lg leading-relaxed text-[#4A4F68]">
                        {translations?.mainPage.subtitle}
                    </p>
                    <BoardPreview/>
                </section>

                <section className="mx-auto min-w-0 max-w-md flex-[1_1_380px]">
                    <Session
                        isOpen={showCreateSession}
                        onClose={() => setShowCreateSession(false)}
                    />

                    {!showCreateSession && (
                        <div
                            className="flex flex-col gap-6 rounded-[28px] border border-[#E2E6F2] bg-white p-8 shadow-[0_24px_48px_-16px_rgba(67,56,202,0.22)]">
                            <Button
                                className="h-14 w-full cursor-pointer rounded-2xl bg-indigo-700 text-base font-semibold hover:bg-indigo-800"
                                onClick={() => setShowCreateSession(true)}
                            >
                                <Plus className="mr-2 h-5 w-5" aria-hidden="true"/>
                                {translations?.mainPage.button.createSession}
                            </Button>

                            <div
                                className="flex items-center gap-3.5 text-xs font-semibold uppercase tracking-wider text-[#5B6078]">
                                <span className="h-px flex-1 bg-[#E2E6F2]"/>
                                {translations?.mainPage.infoMessage}
                                <span className="h-px flex-1 bg-[#E2E6F2]"/>
                            </div>

                            <Join/>
                        </div>
                    )}
                </section>
            </main>

            <Footer/>
        </div>
    );
}
