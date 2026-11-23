import {Check, Crown, X} from "lucide-react";
import type {GETSessionResponseData} from "../../../../../types/api";
import type {User} from "../../../../../types/user";
import {AVATAR_COLORS} from "~/lib/constants";


export default function UsersSelect(
    {
        setSelectedUser,
        data
    }: {
        data: GETSessionResponseData
        setSelectedUser: (user: User) => void
    }
) {

    const sortedUsers = [...data.Users].sort((a: { Name: string; }, b: { Name: string; }) => {
        const nameA = a.Name.toLowerCase();
        const nameB = b.Name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    }).filter(value => value.ID != data.Self.ID)

    return <ul className="space-y-3">
        {sortedUsers.map((user, index) => {
            const canSelect = !data?.Self.HasSubmitted;

            return (
                <li key={user.ID}>
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
                            {user.Name.charAt(0).toUpperCase()}
                        </span>
                        <span className="flex min-w-0 flex-1 items-center gap-2 font-medium text-[#14162B]">
                            <span
                                className={`truncate`}
                            >
                                {user.Name}
                            </span>
                            {user.IsHost && (
                                <>
                                    <Crown className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true"/>
                                    <span className="sr-only">Host</span>
                                </>
                            )}
                        </span>
                        {data.Self.IsHost && (
                            user.HasSubmitted ? (
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