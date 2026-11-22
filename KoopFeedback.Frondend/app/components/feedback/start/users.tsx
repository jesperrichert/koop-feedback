import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import type {User} from "../../../../types/user";
import {Crown, Trash} from "lucide-react";
import {toast} from "react-toastify";
import type {GETSessionResponseData} from "../../../../types/api";
import {useTranslation} from "~/context/translation";

// Gleiche Farben wie die Haftnotizen auf der Startseite
const AVATAR_COLORS = ["bg-[#BDEBD3]", "bg-[#FFE58A]", "bg-[#FFC2D1]"];

export default function Users(
    {
        data,
        authId,
        startSession
    }: {
        data: GETSessionResponseData,
        authId: string,
        startSession: () => void
    }
) {
    const {translations} = useTranslation()

    const handleRemoveUser = async (user: User) => {
        fetch(
            `/api/v2/user/${user.ID}`,
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
                toast(error.message, {
                    type: "error",
                    position: "top-right",
                    autoClose: 5000,
                });
            });
    }

    return (
        <div className="lg:col-span-2">
            <Card className="rounded-3xl border border-[#E2E6F2] bg-white shadow-[0_24px_48px_-16px_rgba(67,56,202,0.18)]">
                <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                        <CardTitle className="font-display text-xl font-bold tracking-tight text-[#14162B]">
                            {translations?.session.participants} ({data.Users.length})
                        </CardTitle>
                        {
                            (!data.Session.IsStarted && data.Self.IsHost) && (
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
                        {data.Users.map((user: User, index: number) => (
                            <li
                                key={user.ID}
                                className="flex items-center gap-4 rounded-2xl bg-[#F4F6FB] p-3"
                            >
                                <div
                                    aria-hidden="true"
                                    className={`${AVATAR_COLORS[index % AVATAR_COLORS.length]} flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[#14162B]`}
                                >
                                    {user.Name.charAt(0).toUpperCase()}
                                </div>
                                <span className="min-w-0 flex-1 truncate font-medium text-[#14162B]">
                                    {user.Name}
                                </span>
                                {user.IsHost ? (
                                    <span className="flex h-11 w-11 items-center justify-center">
                                        <Crown className="h-5 w-5 text-amber-600" aria-hidden="true"/>
                                        <span className="sr-only">Host</span>
                                    </span>
                                ) : (
                                    data.Self.IsHost && (
                                        <button
                                            type="button"
                                            aria-label={`Remove ${user.Name}`}
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