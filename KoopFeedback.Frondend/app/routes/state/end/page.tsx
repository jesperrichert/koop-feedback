"use client";

import {useEffect, useState} from "react";
import {LogOut} from "lucide-react";
import {useTranslation} from "~/context/translation";
import {type Feedback, FeedbackType} from "../../../../types/feedback/feedback";
import Loading from "~/components/app/loading";
import type {DefaultAPIResponse} from "../../../../types/api";
import {Button} from "~/components/ui/button";
import {StickyNote} from "~/components/custom/stick-note";
import Header from "~/components/app/header";
import type {StickyTone} from "../../../../types/feedback/sticky-note";
import {TILTS} from "~/lib/constants";
import {API_ENDPOINT} from "~/lib/env";


export default function EndPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [feedbacks, setFeedbacks] = useState<Feedback[] | null>([]);
    const {translations} = useTranslation()

    useEffect(() => {
        const load = async () => {
                const authIdCookie = await cookieStore.get("authId")
                if (!authIdCookie)
                    return window.location.href = "/";

                await fetch(`${API_ENDPOINT}/api/v2/user/feedback`, {
                    method: "GET",
                    headers: {
                        "Authorization": authIdCookie.value as string,
                        "Content-Type": "application/json",
                    },
                }).then(async (response) => {
                    return {
                        dto: await response.json(),
                        res: response
                    }
                }).then((obj: {
                    dto: DefaultAPIResponse<Feedback[]>,
                    res: Response,
                }) => {
                    if (!obj.res.ok || !obj.dto.Success) {
                        setFeedbacks(null)
                        setIsLoading(false)
                        return
                    }
                    if (obj.dto.Message == "NotActive") return window.open("/state/run", "_self")

                    setFeedbacks(obj.dto.Data);
                }).catch(_ => setFeedbacks(null))
                    .finally(() => setIsLoading(false))
            }
        ;
        load();
    })

    if (isLoading) return <Loading/>

    const logoutSession = async () => {
        const authIdCookie = await cookieStore.get("authId")
        await fetch(`${API_ENDPOINT}/api/v2/user/logout`, {
            method: "DELETE",
            headers: {
                "Authorization": authIdCookie?.value as string,
                "Content-Type": "application/json",
            },
        }).then(_ => window.open("/", "_self"))
    }

    const all = feedbacks ?? [];
    const positive = all.filter(fb => fb.Type == FeedbackType.Positive);
    const improve = all.filter(fb => fb.Type != FeedbackType.Positive);

    const columns: { title: string; tone: StickyTone; labelClass: string; items: Feedback[] }[] = [
        {
            title: translations?.mainPage.columns[0].title ?? "Positive",
            tone: "mint",
            labelClass: "text-[#3C6B52]",
            items: positive
        },
        {
            title: translations?.mainPage.columns[1].title ?? "Neutral",
            tone: "amber",
            labelClass: "text-[#8A6A00]",
            items: improve
        },
    ];

    return (
        <div className="min-h-screen bg-[#F4F6FB] text-[#14162B]">
            <Header>
                <Button
                    variant="outline"
                    className="h-11 cursor-pointer rounded-full border-2 border-[#14162B] bg-transparent px-5 font-semibold text-[#14162B] hover:bg-[#14162B] hover:text-white"
                    onClick={() => logoutSession()}
                >
                    <LogOut className="mr-2 h-4 w-4" aria-hidden="true"/>
                    {translations?.endSession.button.logout}
                </Button>
            </Header>

            <main className="mx-auto w-full max-w-6xl px-8 pb-16 pt-6">
                <h1 className="mb-10 text-center font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                    {translations?.endSession.title}
                </h1>

                {all.length === 0 ? (
                    <p className="mx-auto max-w-xl rounded-2xl border-2 border-dashed border-[#D3D9EC] p-8 text-center text-lg text-[#5B6078]">
                        {translations?.endSession.noFeedback}
                    </p>
                ) : (
                    <div
                        className="grid grid-cols-1 gap-8 rounded-3xl border border-[#E2E6F2] bg-white p-6 shadow-[0_24px_48px_-16px_rgba(67,56,202,0.18)] sm:p-8 md:grid-cols-2">
                        {columns.map((column) => (
                            <section key={column.title} className="flex flex-col gap-4">
                                <h2 className={`text-xs font-bold uppercase tracking-widest ${column.labelClass}`}>
                                    {column.title} ({column.items.length})
                                </h2>
                                <ul className="flex flex-col gap-4">
                                    {column.items.map((fb, index) => (
                                        <li>
                                            <StickyNote
                                                tone={column.tone}
                                                tilt={TILTS[index % TILTS.length]}
                                            >
                                                <span className="whitespace-pre-wrap break-words">
                                                    {fb.Description}
                                                </span>
                                            </StickyNote>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
