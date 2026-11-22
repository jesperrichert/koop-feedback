import {Check} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {useTranslation} from "~/context/translation";

export default function FeedbackSent() {
    const {translations} = useTranslation()

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F4F6FB] px-4">
            <Card
                role="status"
                className="w-full max-w-md rounded-[28px] border border-[#E2E6F2] bg-white p-2 shadow-[0_24px_48px_-16px_rgba(67,56,202,0.22)]"
            >
                <CardHeader className="flex items-center gap-4">
                    <div
                        aria-hidden="true"
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#BDEBD3]"
                    >
                        <Check className="h-7 w-7 text-[#14162B]" strokeWidth={2.5}/>
                    </div>
                    <CardTitle className="text-center font-display text-2xl font-bold tracking-tight text-[#14162B]">
                        {translations?.runSession.alreadySubmitted}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-base leading-relaxed text-[#4A4F68]">
                        {translations?.runSession.alreadySubmittedTooltip}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}