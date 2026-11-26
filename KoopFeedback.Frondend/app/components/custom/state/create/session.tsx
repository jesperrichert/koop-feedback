"use client";

import {LoaderCircle, Plus, XCircle} from "lucide-react";
import {useState} from "react";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {Label} from "~/components/ui/label";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {useTranslation} from "~/context/translation";
import {API_ENDPOINT} from "~/lib/env";
import type {DefaultAPIResponse, CreateSessionResponse, CreateSessionRequest} from "../../../../../types/api";
import { toast } from "~/lib/api";

export function Session(
    {
        isOpen,
        onClose
    }: {
        isOpen: boolean;
        onClose: () => void;
    }
) {
    if (!isOpen) return null;

    const [name, setName] = useState<string | null>();
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const {translations} = useTranslation();

    const handleCreateSession = async () => {
            if (name && !name.trim() || isCreating) return;
            setIsCreating(true);
            await fetch(`${API_ENDPOINT}/api/v2/session`, {
                method: "POST",
                body: JSON.stringify({
                    host_name: name!.trim()
                } satisfies CreateSessionRequest)
            }).then(async (res) => {
                return {
                    res: res,
                    dto: await res.json()
                }
            }).then(async (obj: {
                res: Response,
                dto: DefaultAPIResponse<CreateSessionResponse>
            }) => {
                toast(obj.res.status, translations?.codes[obj.dto.code]);
                if (obj.res.status != 200) return
                
                cookieStore.set({
                    name: "authId",
                    value: obj.dto.data.authId
                }).then(_ => {
                    toast(200, translations?.toasts.session.created);
                    setTimeout(() => {
                        window.location.assign("/state/start");
                    }, 500);
                });
            }).catch(_ => toast(500, translations?.toasts.session.creationFailed))
                .finally(() => setIsCreating(false));
        }
    ;

    return (
        <Card
            className="w-full max-w-md rounded-[28px] border border-[#E2E6F2] bg-white p-2 shadow-[0_24px_48px_-16px_rgba(67,56,202,0.22)]">
            <CardHeader>
                <CardTitle className=" p-2 flex font-display text-[28px] font-bold tracking-tight text-[#14162B]">
                    {translations?.createSession.title}
                    <XCircle className={"ml-10 cursor-pointer"} onClick={() => onClose()}/>
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
                        placeholder={translations?.createSession.name.placeholder}
                        className="h-14 rounded-2xl border-2 border-[#D3D9EC] bg-[#F4F6FB] px-4 text-base text-[#14162B] placeholder:text-[#6B7088] md:text-base"
                        value={name ?? ""}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                void handleCreateSession();
                            }
                        }}
                    />
                </div>

                <Button
                    className="mb-2 h-14 w-full cursor-pointer rounded-2xl bg-indigo-700 text-base font-semibold hover:bg-indigo-800"
                    onClick={handleCreateSession}
                    disabled={!(name ?? "").trim() || isCreating}
                >
                    {isCreating ? (
                        <div className="flex items-center gap-2">
                            <LoaderCircle className={"animate-spin"}/>
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
