import {Dialog, DialogContent, DialogHeader, DialogTitle} from "~/components/ui/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import {Meh, Smile} from "lucide-react";
import {Textarea} from "~/components/ui/textarea";
import {Button} from "~/components/ui/button";
import type {User} from "../../../../../types/user";
import {useTranslation} from "~/context/translation";
import {FeedbackType} from "../../../../../types/feedback/feedback";

const MIN_LENGTH = 10;

export function FeedbackCreate(
    {
        selectedUser,
        setSelectedUser,
        setFeedbackType,
        feedbackType,
        description,
        setDescription,
        handleAddFeedback
    }:
    {
        selectedUser: User | null,
        setSelectedUser: (user: User | null) => void,
        setFeedbackType: (type: string) => void,
        handleAddFeedback: () => void,
        feedbackType: string,
        setDescription: (description: string) => void,
        description: string
    }
) {
    const {translations} = useTranslation()

    const isLongEnough = description.length >= MIN_LENGTH

    return <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent
            className="rounded-[28px] border border-[#E2E6F2] bg-white p-8 shadow-[0_24px_48px_-16px_rgba(67,56,202,0.35)]">
            <DialogHeader>
                <DialogTitle className="font-display text-2xl font-bold tracking-tight text-[#14162B]">
                    Feedback {selectedUser?.Name}
                </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
                <Select
                    onValueChange={(value) => setFeedbackType(value)}
                    value={feedbackType != null ? String(feedbackType) : undefined}
                >
                    <SelectTrigger
                        aria-label="Feedback-Typ"
                        className="h-12 w-full cursor-pointer rounded-xl border-2 border-[#D3D9EC] bg-[#F4F6FB] text-base text-[#14162B] data-[placeholder]:text-[#6B7088]">
                        <SelectValue placeholder="Feedback-Typ"/>
                    </SelectTrigger>
                    <SelectContent
                        className="rounded-xl border border-[#E2E6F2] bg-white text-[#14162B]">
                        <SelectItem
                            value={String(FeedbackType.Positive)}
                            className="cursor-pointer px-3 py-2.5 focus:bg-[#F4F6FB]"
                        >
                            <Smile className="h-4 w-4 text-emerald-700" aria-hidden="true"/>
                            <span>Positiv</span>
                        </SelectItem>
                        <SelectItem
                            value={String(FeedbackType.Normal)}
                            className="cursor-pointer px-3 py-2.5 focus:bg-[#F4F6FB]"
                        >
                            <Meh className="h-4 w-4 text-amber-700" aria-hidden="true"/>
                            <span>Neutral</span>
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Textarea
                    placeholder=""
                    aria-label="Feedback"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px] rounded-xl border-2 border-[#D3D9EC] bg-[#F4F6FB] p-3 text-base text-[#14162B] placeholder:text-[#6B7088] md:text-base"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span
                        aria-live="polite"
                        className={`text-sm font-medium ${isLongEnough ? "text-emerald-700" : "text-[#5B6078]"}`}
                    >
                        min. {description.length}/{MIN_LENGTH} characters
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="h-11 cursor-pointer rounded-xl border-2 border-[#D3D9EC] bg-transparent px-5 font-semibold text-[#14162B] hover:bg-[#F4F6FB]"
                            onClick={() => setSelectedUser(null)}
                        >
                            {translations?.runSession.button.cancel}
                        </Button>
                        <Button
                            onClick={handleAddFeedback}
                            disabled={!isLongEnough}
                            className="h-11 cursor-pointer rounded-xl bg-indigo-700 px-5 font-semibold text-white hover:bg-indigo-800"
                        >
                            {translations?.runSession.button.submitFeedback}
                        </Button>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>

}