"use client";

import { Copy } from "lucide-react";
import { useEffect, useState } from "react";

import { useTranslation } from "~/context/translation";
import type { DefaultAPIResponse, GetSessionResponse } from "../../../../types/api";
import Loading from "~/components/app/loading";
import SessionUsers from "~/components/custom/state/start/session.users";
import SessionQrcode from "~/components/custom/state/start/session.qrcode";
import Header from "~/components/app/header";
import { auth } from "~/lib/auth";
import { API_ENDPOINT } from "~/lib/env";
import { NotFound } from "~/components/custom/not-found";
import { toast } from "~/lib/api";

export default function SessionPage() {
    const [data, setData] = useState<GetSessionResponse | null>(null);
    const [authId, setAuthId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { translations } = useTranslation()

    useEffect(() => {
        const load = async () => {
            const token = await auth();
            setAuthId(token ?? "")
            await fetch(`${API_ENDPOINT}/api/v2/session`, {
                method: "GET",
                headers: {
                    "Authorization": token ?? "",
                    "Content-Type": "application/json",
                },
            }).then(value => value.json())
                .then((value: DefaultAPIResponse<GetSessionResponse>) => setData(value.data))
                .catch(() => {
                    toast(500, translations?.toasts.session.loadFailed)
                });

            if (data?.session.is_started) return window.open("/state/run", "_self")
            setIsLoading(false);
        }

        const interval = setInterval(load, 1000);
        return () => clearInterval(interval);
    });

    const copySessionCode = async () => {
        if (!data) return;
        await navigator.clipboard.writeText(data.session.code.toString());
        toast(200, translations?.toasts.session.codeCopied);
    };

    const startSession = async () => {
        await fetch(`${API_ENDPOINT}/api/v2/session/start`, {
            method: "POST",
            headers: {
                "Authorization": authId as string,
                "Content-Type": "application/json",
            },
        }).then(async (response) => {
            const json = await response.json();
            toast(response.status, translations?.codes[json.code] ?? "");
        })
    }


    if (isLoading) return <Loading />
    if (!data) return <NotFound />

    return (
        <div className="min-h-screen bg-[#F4F6FB] text-[#14162B]">
            <Header>
                <button
                    type="button"
                    onClick={copySessionCode}
                    className="flex min-h-11 cursor-pointer items-center gap-3 rounded-full border border-[#E2E6F2] bg-white py-2 pl-5 pr-4 text-sm text-[#4A4F68] transition-colors hover:border-indigo-700 hover:text-[#14162B]"
                >
                    <span>
                        Code{" "}
                        <span className="font-display text-base font-bold tracking-widest text-[#14162B]">
                            {data.session.code}
                        </span>
                    </span>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                </button>
            </Header>

            <main className="mx-auto w-full max-w-6xl px-8 pb-16 pt-2">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <SessionQrcode
                        code={data.session.code}
                    />
                    <SessionUsers
                        startSession={startSession}
                        authId={authId || ""}
                        data={data}
                    ></SessionUsers>
                </div>
            </main>
        </div>
    );
}
