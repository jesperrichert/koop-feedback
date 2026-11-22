"use client";

import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useTranslation} from "~/context/translation";
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import type {DefaultAPIResponse, GETSessionResponseData, POSTSessionFeedbackResponseData} from "../../../../types/api";
import type {User} from "../../../../types/user";
import {type Feedback, FeedbackType} from "../../../../types/feedback/feedback";
import NotFound from "~/components/not-found";
import Loading from "~/components/app/loading";
import FeedbackSent from "~/components/feedback/run/feedback-sent";
import {FeedbackCreate} from "~/components/feedback/run/feedback-create";
import Users from "~/components/feedback/run/users";
import FeedbackView from "~/components/feedback/run/feedback";
import Header from "~/components/app/header";

export default function SessionPage() {
    const [data, setData] = useState<GETSessionResponseData | null>(null);
    const [authId, setAuthId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [feedbackType, setFeedbackType] = useState<FeedbackType>();
    const [feedbackDescription, setFeedbackDescription] = useState<string>("");
    const {translations} = useTranslation()

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const authIdCookie = await cookieStore.get("authId")
                if (!authIdCookie) {
                    window.location.href = "/";
                    return;
                }
                setAuthId(authIdCookie.value as string)

                const req = await fetch("/api/v2/session", {
                    method: "GET",
                    headers: {
                        "Authorization": authIdCookie.value as string,
                        "Content-Type": "application/json",
                    },
                });
                const apiData = await req.json() as DefaultAPIResponse<GETSessionResponseData>

                if (apiData?.Data.Session.IsFinished) return window.open("/feedback/end", "_self")

                setData(apiData.Data)
            } catch (error) {
                toast.error(translations?.toasts.session.loadFailed);
                window.open("/", "_self")
            } finally {
                setIsLoading(false);
            }
        };

        fetchSession();
        const interval = setInterval(fetchSession, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleAddFeedback = async () => {
        if (!selectedUser) return;

        if (feedbackDescription.length <= 0) {
            toast.error(translations?.toasts.validation.descriptionRequired);
            return;
        }

        const newFeedback = {
            Id: feedback.length + 1,
            Type: parseInt(String(feedbackType)),
            Description: feedbackDescription,
            UserId: selectedUser.ID
        } as Feedback

        setFeedback((prev) => [...prev, newFeedback]);
        setSelectedUser(null);
        setFeedbackType(0);
        setFeedbackDescription("");
        toast.success(translations?.toasts.feedback.added);
    };

    const handleRemoveFeedback = (id: number) => {
        setFeedback((prev) => prev.filter((feedback) => feedback.Id !== id));
        toast.info(translations?.toasts.feedback.removed);
    };

    const handleSubmitAllFeedback = async () => {
        if (feedback.length === 0) {
            toast.warning(translations?.toasts.feedback.noFeedbackSubmitted);
            return;
        }

        const req = await fetch(`/api/v2/session/feedback`, {
            method: "POST",
            headers: {
                "Authorization": authId as string,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Feedback: feedback
            }),
        });
        const feedbackRes = await req.json() as DefaultAPIResponse<POSTSessionFeedbackResponseData>
        if (feedbackRes.Success) {
            toast.info(
                `${feedback.length} ${translations?.toasts.feedback.itemsSubmitted}!`
            );
            if (feedbackRes.Data.Success > 0) toast.success(
                `${feedbackRes.Data.Success} SUCCESS`
            );
            if (feedbackRes.Data.Failed > 0) toast.error(
                `${feedbackRes.Data.Failed} FAILED`
            );

        } else toast.error(feedbackRes.Message);


        setFeedback([]);
    };

    const handleEnd = async () => {
        const req = await fetch("/api/v2/session/end", {
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
    if (!data) return <NotFound></NotFound>
    if (data?.Self.HasSubmitted && !data.Self.IsHost) return <FeedbackSent/>

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
                        <span className="ml-1 font-semibold text-[#14162B]">{data.Self?.Name}</span>
                    </span>
                </div>
            </Header>

            <FeedbackCreate
                feedbackType={feedbackType as unknown as string}
                setFeedbackType={type => setFeedbackType(type as unknown as FeedbackType)}
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
                                {translations?.runSession.participants} ({data.Users.length})
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

                        <Users
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
                                disabled={data.Self.HasSubmitted}
                            >
                                {translations?.runSession.button.submitFeedback} ({feedback.length})
                            </Button>
                            {data.Self.IsHost && (
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