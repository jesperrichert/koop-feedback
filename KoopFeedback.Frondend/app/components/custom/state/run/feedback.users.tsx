import {Check, Crown, X} from "lucide-react";
import type {GetSessionResponse} from "../../../../../types/api";
import type {UserDto} from "../../../../../types/userDto";
import {AVATAR_COLORS} from "~/lib/constants";


export default function UsersSelect(
    {
        setSelectedUser,
        data
    }: {
        data: GetSessionResponse
        setSelectedUser: (user: UserDto) => void
    }
) {

    const sortedUsers = [...data.users].sort((a: { name: string; }, b: { name: string; }) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    }).filter(value => value.id != data.self.id)

    return <ul className="space-y-3">
        {sortedUsers.map((user, index) => {
            const canSelect = !data?.self.has_submitted;

            return (
                <li key={user.id}>
                    <button
                        type="button"
                        disabled={!canSelect}
                        onClick={() => setSelectedUser(user)}
                        className={`flex min-h-14 w-full items-center gap-4 rounded-2xl bg-[#F4F6FB] p-3 text-left transition-colors ${
                            canSelect
                                ? "cursor-pointer hover:bg-[#E6EAF7]"
                                : "cursor-default"
                        }`}
                    >
                        <span
                            aria-hidden="true"
                            className={`${AVATAR_COLORS[index % AVATAR_COLORS.length]} flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[#14162B]`}
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="flex min-w-0 flex-1 items-center gap-2 font-medium text-[#14162B]">
                            <span
                                className={`truncate`}
                            >
                                {user.name}
                            </span>
                            {user.is_host && (
                                <>
                                    <Crown className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true"/>
                                    <span className="sr-only">Host</span>
                                </>
                            )}
                        </span>
                        {data.self.is_host && (
                            user.has_submitted ? (
                                <span className="flex shrink-0 items-center">
                                    <Check className="h-5 w-5 text-emerald-700" aria-hidden="true"/>
                                    <span className="sr-only">Submitted</span>
                                </span>
                            ) : (
                                <span className="flex shrink-0 items-center">
                                    <X className="h-5 w-5 text-red-700" aria-hidden="true"/>
                                    <span className="sr-only">Not submitted</span>
                                </span>
                            )
                        )}
                    </button>
                </li>
            );
        })}
    </ul>

}