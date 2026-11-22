
"use client";

import {ArrowRight} from "lucide-react";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {Label} from "~/components/ui/label";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {useTranslation} from "~/context/translation";
import type {DefaultAPIResponse, POSTCreateSessionResponseData} from "../../../../types/api";
import JoinInput from "~/components/feedback/create/join-input";
import {API_ENDPOINT} from "~/lib/env";

export default function JoinSession() {
    const [code, setCode] = useState<number>();
    const [showUserNameInput, setShowUserNameInput] = useState(false);
    const [userName, setUserName] = useState("");
    const [isJoining, setIsJoining] = useState(false);

    const {translations} = useTranslation();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const codeParam = params.get("code");

        if (!codeParam || !/^\d+$/.test(codeParam)) return;

        const parsedCode = Number(codeParam);

        if (!Number.isSafeInteger(parsedCode)) return;

        setCode(parsedCode);
        setShowUserNameInput(true);
    }, []);

    const handleJoin = async () => {
        if (!userName.trim()) {
            toast.error(translations?.toasts.validation.nameRequired);
            return;
        }

        if (code == null || !Number.isSafeInteger(code)) {
            toast.error(translations?.toasts.session.invalidCode);
            return;
        }

        if (isJoining) return;

        setIsJoining(true);

        try {
            const req = await fetch(`${API_ENDPOINT}/api/v2/session/join`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Code: code,
                    Name: userName.trim()
                })
            });

            const res = await req.json() as DefaultAPIResponse<POSTCreateSessionResponseData>;

            if (!req.ok || !res.Success) {
                toast.error(translations?.toasts.session.joinFailed);
                return;
            }

            await cookieStore.set({
                name: "authId",
                value: res.Data.authId
            });

            toast.success(translations?.toasts.session.joined);

            window.location.assign("/feedback/start");
        } catch {
            toast.error(translations?.toasts.session.joinFailed);
        } finally {
            setIsJoining(false);
        }
    };

    const handleOpenJoin = () => {
        if (code == null || !Number.isSafeInteger(code)) {
            toast.error(translations?.toasts.session.invalidCode);
            return;
        }

        setShowUserNameInput(true);
    };

    return (
        <div className="space-y-3">
            <Label
                htmlFor="code"
                className="text-[15px] font-semibold text-[#14162B]"
            >
                {translations?.mainPage.code.label}
            </Label>

            <Input
                id="code"
                inputMode="numeric"
                autoComplete="off"
                value={code ?? ""}
                onChange={(e) => {
                    const value = e.target.value;

                    if (!/^\d*$/.test(value)) return;

                    const parsedCode = value ? Number(value) : undefined;

                    setCode(
                        parsedCode !== undefined && Number.isSafeInteger(parsedCode)
                            ? parsedCode
                            : undefined
                    );
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleOpenJoin();
                    }
                }}
                placeholder={translations?.mainPage.code.placeholder}
                className="h-14 rounded-2xl border-2 border-[#D3D9EC] bg-[#F4F6FB] px-4 text-xl font-semibold tracking-[0.18em] text-[#14162B] placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-[#6B7088] md:text-xl"
            />

            <Button
                onClick={handleOpenJoin}
                variant="outline"
                className="h-14 w-full cursor-pointer rounded-2xl border-2 border-[#14162B] bg-transparent text-base font-semibold text-[#14162B] hover:bg-[#14162B] hover:text-white"
            >
                {translations?.mainPage.code.join}
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true"/>
            </Button>

            {showUserNameInput && (
                <JoinInput
                    userName={userName}
                    setUserName={setUserName}
                    onClose={() => setShowUserNameInput(false)}
                    handleJoin={handleJoin}
                />
            )}
        </div>
    );
}
