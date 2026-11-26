import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import type {UserDto} from "../../../../../types/userDto";
import {Crown, Trash} from "lucide-react";

import type {GetSessionResponse} from "../../../../../types/api";
import {useTranslation} from "~/context/translation";
import {API_ENDPOINT} from "~/lib/env";
import {AVATAR_COLORS} from "~/lib/constants";
import { toast } from "~/lib/api";

export default function SessionUsers(
    {
        data,
        authId,
        startSession
    }: {
        data: GetSessionResponse,
        authId: string,
        startSession: () => void
    }
) {
    const {translations} = useTranslation()

    const handleRemoveUser = async (user: UserDto) => {
        fetch(
            `${API_ENDPOINT}/api/v2/user/${user.id}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": authId as string,
                    "Content-Type": "application/json",
                },
            }
        )
            .then((res) => {
                if (!res.ok) {
                    throw new Error(
                        "Failed to remove user"
                    );
                }
                return res.json();
            })
            .catch((error) => {
                toast(500, error.message)
            });
    }

    return (
        <div className="lg:col-span-2">
            <Card
                className="rounded-3xl border border-[#E2E6F2] bg-white shadow-[0_24px_48px_-16px_rgba(67,56,202,0.18)]">
                <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                        <CardTitle className="font-display text-xl font-bold tracking-tight text-[#14162B]">
                            {translations?.session.participants} ({data.users.length})
                        </CardTitle>
                        {
                            (!data.session.is_started && data.self.is_host) && (
                                <Button
                                    variant="default"
                                    className="h-11 cursor-pointer rounded-xl bg-indigo-700 px-5 font-semibold text-white hover:bg-indigo-800"
                                    onClick={startSession}
                                >
                                    {translations?.session.button.start}
                                </Button>
                            )
                        }
                    </div>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {data.users.map((user: UserDto, index: number) => (
                            <li
                                key={user.id}
                                className="flex items-center gap-4 rounded-2xl bg-[#F4F6FB] p-3"
                            >
                                <div
                                    aria-hidden="true"
                                    className={`${AVATAR_COLORS[index % AVATAR_COLORS.length]} flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[#14162B]`}
                                >
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="min-w-0 flex-1 truncate font-medium text-[#14162B]">
                                    {user.name}
                                </span>
                                {user.is_host ? (
                                    <span className="flex h-11 w-11 items-center justify-center">
                                        <Crown className="h-5 w-5 text-amber-600" aria-hidden="true"/>
                                        <span className="sr-only">Host</span>
                                    </span>
                                ) : (
                                    data.self.is_host && (
                                        <button
                                            type="button"
                                            aria-label={`Remove ${user.name}`}
                                            onClick={() => handleRemoveUser(user)}
                                            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[#5B6078] transition-colors hover:bg-red-50 hover:text-red-700"
                                        >
                                            <Trash className="h-5 w-5" aria-hidden="true"/>
                                        </button>
                                    )
                                )}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}