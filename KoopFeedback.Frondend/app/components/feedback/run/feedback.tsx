import {Lightbulb, ThumbsUp, Trash} from "lucide-react";
import type {GETSessionResponseData} from "../../../../types/api";
import {type Feedback, FeedbackType} from "../../../../types/feedback/feedback";

export default function FeedbackView(
    {
        data,
        feedback,
        handleRemoveFeedback
    }:
    {
        data: GETSessionResponseData,
        feedback: Feedback[],
        handleRemoveFeedback: (id: number) => void
    }
) {

    const nameOf = (userId: number) =>
        data.Users.filter(value => value.ID == userId)[0].Name

    // Kopie sortieren, damit das Array aus dem State nicht verändert wird
    const sorted = [...feedback].sort((a, b) => {
        const nameCompare = nameOf(a.UserId).localeCompare(nameOf(b.UserId));
        if (nameCompare !== 0) return nameCompare;

        return a.Type == FeedbackType.Positive ? -1 : 1;
    });

    return <ul className="space-y-3">
        {sorted.map((item) => {
            const positive = item.Type == FeedbackType.Positive;
            const Icon = positive ? ThumbsUp : Lightbulb;

            return (
                <li
                    key={item.Id}
                    className={`flex items-start justify-between gap-3 rounded-xl p-4 text-[#14162B] shadow-[0_6px_14px_rgba(20,22,43,0.10)] ${
                        positive ? "bg-[#BDEBD3]" : "bg-[#FFE58A]"
                    }`}
                >
                    <div className="min-w-0">
                        <p className="flex items-center gap-2 font-display text-lg font-bold leading-tight">
                            <Icon className="h-4 w-4 shrink-0" aria-hidden="true"/>
                            <span className="sr-only">{positive ? "Positive:" : "Improvement:"}</span>
                            <span className="truncate">{nameOf(item.UserId)}</span>
                        </p>
                        <p className="mt-1.5 break-words text-sm leading-snug text-[#2B2F4A]">
                            {item.Description}
                        </p>
                    </div>
                    <button
                        type="button"
                        aria-label={`Remove feedback for ${nameOf(item.UserId)}`}
                        onClick={() => handleRemoveFeedback(item.Id)}
                        className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#14162B]/70 transition-colors hover:bg-[#14162B]/10 hover:text-[#14162B]"
                    >
                        <Trash className="h-4 w-4" aria-hidden="true"/>
                    </button>
                </li>
            );
        })}
    </ul>
}