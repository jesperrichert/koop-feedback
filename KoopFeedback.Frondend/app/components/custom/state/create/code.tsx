import {LogIn, X} from "lucide-react";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {useTranslation} from "~/context/translation";

export default function CodeInput(
    {
        userName,
        setUserName,
        onClose,
        handleJoin
    }: {
        userName: string;
        setUserName: (name: string) => void;
        onClose: () => void;
        handleJoin: () => void;
    }
) {
    const {translations} = useTranslation();
    const title = translations?.session.qrCode.title;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#14162B]/50 px-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="relative w-full max-w-md rounded-[28px] border border-[#E2E6F2] bg-white p-8 shadow-[0_24px_48px_-16px_rgba(67,56,202,0.35)]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[#5B6078] hover:bg-[#F4F6FB] hover:text-[#14162B]"
                >
                    <X className="h-5 w-5" aria-hidden="true"/>
                </button>

                <h2 className="mb-5 pr-10 font-display text-2xl font-bold tracking-tight text-[#14162B]">
                    {title}
                </h2>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                        id="name"
                        autoFocus
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleJoin();
                            }
                        }}
                        placeholder={translations?.toasts.validation.nameRequired}
                        aria-label={translations?.toasts.validation.nameRequired}
                        className="h-14 rounded-2xl border-2 border-[#D3D9EC] bg-[#F4F6FB] px-4 text-base text-[#14162B] placeholder:text-[#6B7088] md:text-base"
                    />

                    <Button
                        onClick={handleJoin}
                        className="h-14 cursor-pointer rounded-2xl bg-indigo-700 px-6 text-base font-semibold hover:bg-indigo-800"
                    >
                        <LogIn className="mr-2 h-5 w-5" aria-hidden="true"/>
                        {translations?.mainPage.code.join}
                    </Button>
                </div>
            </div>
        </div>
    );
}