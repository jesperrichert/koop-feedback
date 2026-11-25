"use client";

import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useTranslation} from "~/context/translation";
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import type {
    AddFeedbackRequest,
    DefaultAPIResponse,
    GetSessionFeedbackResponse,
    GetSessionResponse
} from "../../../../types/api";
import type {UserDto} from "../../../../types/userDto";
import {type FeedbackDto, FeedbackType} from "../../../../types/feedback/feedbackDto";
import {NotFound} from "~/components/custom/not-found";
import Loading from "~/components/app/loading";
import FeedbackSent from "~/components/custom/state/run/feedback.sent";
import {FeedbackCreate} from "~/components/custom/state/run/feedback.create";
import UserSelectFeedback from "~/components/custom/state/run/feedback.users";
import FeedbackView from "~/components/custom/state/run/feedback.display";
import Header from "~/components/app/header";
import {API_ENDPOINT} from "~/lib/env";

export default function SessionPage() {
    const [data, setData] = useState<GetSessionResponse | null>(null);
    const [authId, setAuthId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
    const [feedback, setFeedback] = useState<FeedbackDto[]>([]);
    const [selectedFeedbackType, setSelectedFeedbackType] = useState<FeedbackType | null>();
    const [feedbackDescription, setFeedbackDescription] = useState<string>("");
    const {translations} = useTranslation()

    useEffect(() => {
        const session = async () => {
            const authIdCookie = await cookieStore.get("authId")
            if (!authIdCookie) return window.location.href = "/";
            setAuthId(authIdCookie.value as string)

            await fetch(`${API_ENDPOINT}/api/v2/session`, {
                method: "GET",
                headers: {
                    "Authorization": authIdCookie.value as string,
                    "Content-Type": "application/json",
                },
            }).then(async (response) => {
                return {
                    dto: await response.json(),
                    res: response,
                }
            }).then((obj: {
                dto: DefaultAPIResponse<GetSessionResponse>,
                res: Response,
            }) => {
                if (obj.dto?.data.session.is_finished) return window.open("/state/end", "_self")
                setData(obj.dto.data)
            }).catch(_ => {
                toast.error(translations?.toasts.session.loadFailed);
            }).finally(() => setIsLoading(false))
        }
        const interval = setInterval(session, 1000);
        return () => clearInterval(interval);
    }, [])

    const handleAddFeedback = async () => {
        if (!selectedUser) return;
        if (feedbackDescription.length <= 0)
            return toast.error(translations?.toasts.validation.descriptionRequired);

        const created = {
            type: parseInt(String(selectedFeedbackType)),
            description: feedbackDescription,
            user_id: selectedUser.id
        } satisfies FeedbackDto

        setFeedback((prev) => [...prev, created]);
        setSelectedUser(null);
        setSelectedFeedbackType(null);
        setFeedbackDescription("");
        toast.success(translations?.toasts.feedback.added);
    }

    const handleRemoveFeedback = (feedback: FeedbackDto) => {
        setFeedback((prev) => prev.filter((f) => feedback !== f));
        toast.info(translations?.toasts.feedback.removed);
    };

    const handleSubmitAllFeedback = async () => {
        if (feedback.length === 0)
            return toast.warning(translations?.toasts.feedback.noFeedbackSubmitted);

        const req = await fetch(`${API_ENDPOINT}/api/v2/session/feedback`, {
            method: "POST",
            headers: {
                "Authorization": authId as string,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                feedback: feedback
            } satisfies AddFeedbackRequest),
        });
        const dto = await req.json() as DefaultAPIResponse<GetSessionFeedbackResponse>
        if (dto.success) {
            toast.info(
                `${feedback.length} ${translations?.toasts.feedback.itemsSubmitted}!`
            );
            if (dto.data.success > 0) toast.success(
                `${dto.data.success} SUCCESS`
            );
            if (dto.data.failed > 0) toast.error(
                `${dto.data.failed} FAILED`
            );

        } else toast.error(dto.code);
        setFeedback([]);
    };

    const handleEnd = async () => {
        const req = await fetch(`${API_ENDPOINT}/api/v2/session/end`, {
            method: "POST",
            headers: {
                "Authorization": authId as string,
                "Content-Type": "application/json",
            },
        });

        req.status == 200 ?
            toast.success(translations?.toasts.session.ended) :
            toast.error(translations?.toasts.session.endFailed);
    }

    if (isLoading) return <Loading></Loading>
    if (!data) return <NotFound/>
    if (data?.self.has_submitted && !data.self.is_host) return <FeedbackSent/>

    return (
        <div className="min-h-screen bg-[#F4F6FB] text-[#14162B]">
            <Header>
                <div className="flex flex-wrap items-center justify-end gap-2 text-sm text-[#4A4F68]">
                    <span
                        className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#E2E6F2] bg-white px-4">
                        <span className="h-2 w-2 rounded-full bg-emerald-600" aria-hidden="true"/>
                        {translations?.runSession.header.sessionCode}: Started
                    </span>
                    <span
                        className="inline-flex min-h-9 items-center rounded-full border border-[#E2E6F2] bg-white px-4">
                        {translations?.runSession.header.loggedInAs}:{" "}
                        <span className="ml-1 font-semibold text-[#14162B]">{data.self?.name}</span>
                    </span>
                </div>
            </Header>

            <FeedbackCreate
                feedbackType={selectedFeedbackType}
                setFeedbackType={type => setSelectedFeedbackType(type as unknown as FeedbackType)}
                selectedUser={selectedUser}
                setSelectedUser={user => setSelectedUser(user)}
                description={feedbackDescription}
                setDescription={(desc) => setFeedbackDescription(desc)}
                handleAddFeedback={handleAddFeedback}
            />

            <main className="mx-auto flex w-full max-w-6xl justify-center px-8 pb-16 pt-2">
                <Card
                    className="w-full max-w-xl rounded-3xl border border-[#E2E6F2] bg-white shadow-[0_24px_48px_-16px_rgba(67,56,202,0.18)]">
                    <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                            <CardTitle className="font-display text-xl font-bold tracking-tight text-[#14162B]">
                                {translations?.runSession.participants} ({data.users.length})
                            </CardTitle>
                            {feedback.length > 0 && (
                                <span
                                    className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-800">
                                  {feedback.length} {translations?.runSession.feedbackReady}
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>

                        <UserSelectFeedback
                            setSelectedUser={user => setSelectedUser(user)}
                            data={data}
                        />

                        <div className="mt-8">
                            <h3 className="mb-3 font-display text-lg font-bold tracking-tight text-[#14162B]">
                                {translations?.runSession.feedback.title}
                            </h3>
                            {feedback.length === 0 ? (
                                <p className="rounded-2xl border-2 border-dashed border-[#D3D9EC] p-5 text-sm text-[#5B6078]">
                                    {translations?.runSession.feedback.placeholder}
                                </p>
                            ) : (
                                <FeedbackView
                                    feedback={feedback}
                                    data={data}
                                    handleRemoveFeedback={id => handleRemoveFeedback(id)}
                                />
                            )}
                            <Button
                                className="mt-5 h-14 w-full cursor-pointer rounded-2xl bg-indigo-700 text-base font-semibold text-white hover:bg-indigo-800"
                                onClick={handleSubmitAllFeedback}
                                disabled={data.self.has_submitted}
                            >
                                {translations?.runSession.button.submitFeedback} ({feedback.length})
                            </Button>
                            {data.self.is_host && (
                                <Button
                                    variant="outline"
                                    className="mt-3 h-14 w-full cursor-pointer rounded-2xl border-2 border-[#14162B] bg-transparent text-base font-semibold text-[#14162B] hover:bg-[#14162B] hover:text-white"
                                    onClick={handleEnd}
                                >
                                    {translations?.runSession.button.endSession}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}