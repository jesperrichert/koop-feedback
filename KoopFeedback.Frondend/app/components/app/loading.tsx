import {Loader2} from "lucide-react";
import Header from "~/components/app/header";
import Footer from "~/components/app/footer";

export default function Loading() {
    return (
        <div className="flex min-h-screen flex-col bg-[#F4F6FB] text-[#14162B]">
            <Header/>

            <main
                className="mx-auto flex w-full max-w-6xl flex-grow flex-wrap items-center gap-14 px-8 pb-16 pt-6"
                role="status"
                aria-busy="true"
            >
                <section className="flex min-w-0 flex-[1_1_520px] flex-col gap-7" aria-hidden="true">
                    <div className="relative h-32 w-32 sm:h-44 sm:w-44">
                        <div
                            className="absolute inset-0 rounded-full border-[10px] border-indigo-100 sm:border-[14px]"/>
                        <div
                            className="absolute inset-0 animate-spin rounded-full border-[10px] border-transparent border-t-indigo-700 border-r-indigo-400 sm:border-[14px]"/>
                    </div>

                    <div className="flex flex-col gap-3">
                        <span className="h-12 w-4/5 animate-pulse rounded-xl bg-[#E2E6F2] sm:h-14"/>
                        <span className="h-12 w-3/5 animate-pulse rounded-xl bg-[#E2E6F2] sm:h-14"/>
                    </div>
                    <div className="flex max-w-md flex-col gap-2">
                        <span className="h-4 w-full animate-pulse rounded-md bg-[#E2E6F2]"/>
                        <span className="h-4 w-2/3 animate-pulse rounded-md bg-[#E2E6F2]"/>
                    </div>
                </section>

                <section className="mx-auto w-full min-w-0 max-w-md flex-[1_1_380px]" aria-hidden="true">
                    <div
                        className="flex flex-col gap-6 rounded-[28px] border border-[#E2E6F2] bg-white p-8 shadow-[0_24px_48px_-16px_rgba(67,56,202,0.22)]">
                        <div className="flex items-center gap-4">
                            <div
                                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                                <Loader2 className="h-7 w-7 animate-spin"/>
                            </div>
                            <div className="flex flex-1 flex-col gap-2">
                                <span className="h-3 w-1/3 animate-pulse rounded bg-[#E2E6F2]"/>
                                <span className="h-4 w-3/4 animate-pulse rounded-md bg-[#E2E6F2]"/>
                            </div>
                        </div>

                        <div className="h-14 w-full animate-pulse rounded-2xl bg-indigo-100"/>

                        <div className="flex items-center gap-3.5">
                            <span className="h-px flex-1 bg-[#E2E6F2]"/>
                            <span className="h-3 w-8 animate-pulse rounded bg-[#E2E6F2]"/>
                            <span className="h-px flex-1 bg-[#E2E6F2]"/>
                        </div>

                        <div className="h-14 w-full animate-pulse rounded-2xl border border-[#E2E6F2] bg-[#F4F6FB]"/>
                    </div>
                </section>

                <span className="sr-only">...</span>
            </main>

            <Footer/>
        </div>
    );
}