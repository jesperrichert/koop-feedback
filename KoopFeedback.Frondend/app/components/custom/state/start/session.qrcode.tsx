
import {Copy} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {useTranslation} from "~/context/translation";
import QRCode from "react-qr-code";
import { toast } from "~/lib/api";

export default function SessionQrcode({code}: { code: number }) {
    const {translations} = useTranslation()
    const link = `${window.location.origin}?code=${code}`

    return <div className="lg:col-span-1">
        <Card className="rounded-3xl border border-[#E2E6F2] bg-white shadow-[0_24px_48px_-16px_rgba(67,56,202,0.18)]">
            <CardHeader>
                <div className="flex items-center justify-between gap-3">
                    <CardTitle className="font-display text-xl font-bold tracking-tight text-[#14162B]">
                        {translations?.session.qrCode.title}
                    </CardTitle>
                    <button
                        type="button"
                        aria-label="Copy link"
                        onClick={async () => {
                            await navigator.clipboard.writeText(link);
                            toast(200, translations?.toasts.session.codeCopied)
                        }}
                        className="-mr-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[#5B6078] transition-colors hover:bg-[#F4F6FB] hover:text-[#14162B]"
                    >
                        <Copy className="h-4 w-4" aria-hidden="true"/>
                    </button>
                </div>
                <CardDescription className="text-[#4A4F68]">
                    {translations?.session.qrCode.subtitle}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-2">
                <div className="rounded-2xl border border-[#E2E6F2] bg-white p-4">
                    <QRCode value={link}/>
                </div>
            </CardContent>
        </Card>
    </div>
}