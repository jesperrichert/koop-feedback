"use client";

import {Plus} from "lucide-react";
import {useState} from "react";
import {toast} from "react-toastify";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {Label} from "~/components/ui/label";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {useTranslation} from "~/context/translation";
import type {DefaultAPIResponse, POSTCreateSessionResponseData} from "../../../../types/api";
import {API_ENDPOINT} from "~/lib/env";

export function CreateSession(
    {
        isOpen,
        onClose
    }: {
        isOpen: boolean;
        onClose: () => void;
    }
) {
    if (!isOpen) return null;

    const [name, setName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const {translations} = useTranslation();

    const handleCreateSession = async () => {
        if (!name.trim() || isCreating) return;

        setIsCreating(true);

        try {
            const req = await fetch(`${API_ENDPOINT}/api/v2/session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    HostName: name.trim()
                })
            });

            const res = await req.json() as DefaultAPIResponse<POSTCreateSessionResponseData>;

            if (!req.ok || !res.Success) {
                toast.error(translations?.toasts.session.creationFailed);
                return;
            }

            toast.success(translations?.toasts.session.created);

            await cookieStore.set({
                name: "authId",
                value: res.Data.authId
            });

            setTimeout(() => {
                window.location.assign("/feedback/start");
            }, 1000);
        } catch {
            toast.error(translations?.toasts.session.creationFailed);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Card
            className="w-full max-w-md rounded-[28px] border border-[#E2E6F2] bg-white p-2 shadow-[0_24px_48px_-16px_rgba(67,56,202,0.22)]">
            <CardHeader>
                <CardTitle className="font-display text-[28px] font-bold tracking-tight text-[#14162B]">
                    {translations?.createSession.title}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed text-[#4A4F68]">
                    {translations?.createSession.subtitle}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
                <div className="space-y-2">
                    <Label
                        htmlFor="name"
                        className="text-[15px] font-semibold text-[#14162B]"
                    >
                        {translations?.createSession.name.label}
                    </Label>

                    <Input
                        id="name"
                        placeholder={translations?.createSession.name.placeholder}
                        className="h-14 rounded-2xl border-2 border-[#D3D9EC] bg-[#F4F6FB] px-4 text-base text-[#14162B] placeholder:text-[#6B7088] md:text-base"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                void handleCreateSession();
                            }
                        }}
                    />
                </div>

                <Button
                    className="h-14 w-full cursor-pointer rounded-2xl bg-indigo-700 text-base font-semibold hover:bg-indigo-800"
                    onClick={handleCreateSession}
                    disabled={!name.trim() || isCreating}
                >
                    {isCreating ? (
                        <div className="flex items-center">
                            <svg
                                className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            {translations?.createSession.button.creating}
                        </div>
                    ) : (
                        <>
                            <Plus className="mr-2 h-5 w-5" aria-hidden="true"/>
                            {translations?.createSession.button.create}
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
