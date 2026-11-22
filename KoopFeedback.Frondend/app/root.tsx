import {isRouteErrorResponse, Link, Links, Meta, Outlet, Scripts, ScrollRestoration,} from "react-router";

import type {Route} from "./+types/root";
import "./app.css";
import "./toast.css"
import React from "react";
import {TranslationContextProvider, useTranslation} from "~/context/translation";
import {ToastContainer} from "react-toastify";
import {ArrowLeft, Home, SearchX, TriangleAlert} from "lucide-react";
import {Button} from "~/components/ui/button";
import Header from "~/components/app/header";
import Footer from "~/components/app/footer";

export const links: Route.LinksFunction = () => [
    {rel: "preconnect", href: "https://fonts.googleapis.com"},
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    },
];

export function Layout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel={"icon"} href={"/icon.svg"}/>
            <Meta/>
            <Links/>
        </head>
        <body>
        <div className="bg-stone-800">
            <ToastContainer
                position="top-right"
                autoClose={4000}
                limit={3}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
                theme="light"
            />
            <TranslationContextProvider>
                {children}
            </TranslationContextProvider>
            <ScrollRestoration/>
            <Scripts/>
        </div>
        </body>
        </html>
    );
}

export default function App() {
    return <Outlet/>;
}

export function ErrorBoundary({error}: Route.ErrorBoundaryProps) {
    const {translations} = useTranslation();
    let status: number | null = null;
    let message = translations?.mainPage.pageError.message;
    let details = translations?.mainPage.pageError.details;
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        status = error.status;
        if (error.status === 404) {
            message = translations?.mainPage.pageError.message;
            details = translations?.mainPage.pageError.notFound.details;
        } else {
            message = translations?.mainPage.pageError.error;
            details = error.statusText || details;
        }
    }

    const is404 = status === 404;
    const Icon = is404 ? SearchX : TriangleAlert;

    return (
        <div className="flex min-h-screen flex-col bg-[#F4F6FB] text-[#14162B]">
            <Header/>

            <main className="mx-auto flex w-full max-w-6xl flex-grow flex-wrap items-center gap-14 px-8 pb-16 pt-6">
                <section className="flex min-w-0 flex-[1_1_520px] flex-col gap-7">
                    <span
                        className="font-display bg-gradient-to-br from-indigo-700 to-indigo-400 bg-clip-text text-[8rem] font-extrabold leading-none tracking-tighter text-transparent sm:text-[11rem]"
                        aria-hidden="true"
                    >
                        {status ?? translations?.mainPage.pageError.message}
                    </span>
                    <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tighter sm:text-6xl">
                        {message}
                    </h1>
                    <p className="max-w-md text-lg leading-relaxed text-[#4A4F68]">
                        {details}
                    </p>
                </section>
                <section className="mx-auto min-w-0 max-w-md flex-[1_1_380px]">
                    <div
                        className="flex flex-col gap-6 rounded-[28px] border border-[#E2E6F2] bg-white p-8 shadow-[0_24px_48px_-16px_rgba(67,56,202,0.22)]">
                        <div className="flex items-center gap-4">
                            <div
                                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                                <Icon className="h-7 w-7" aria-hidden="true"/>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#5B6078]">
                                    {status ? `${translations?.mainPage.pageError.error} ${status}` : translations?.mainPage.pageError.error}
                                </span>
                                <span className="font-semibold">
                                    {is404 ?
                                        translations?.mainPage.pageError.notFound.text :
                                        translations?.mainPage.pageError.text}
                                </span>
                            </div>
                        </div>

                        <Button
                            asChild
                            className="h-14 w-full cursor-pointer rounded-2xl bg-indigo-700 text-base font-semibold hover:bg-indigo-800"
                        >
                            <Link to="/">
                                <Home className="mr-2 h-5 w-5" aria-hidden="true"/>
                                {translations?.mainPage.pageError.startPage}
                            </Link>
                        </Button>

                        <div
                            className="flex items-center gap-3.5 text-xs font-semibold uppercase tracking-wider text-[#5B6078]">
                            <span className="h-px flex-1 bg-[#E2E6F2]"/>
                            {translations?.mainPage.pageError.filler}
                            <span className="h-px flex-1 bg-[#E2E6F2]"/>
                        </div>

                        <Button
                            variant="outline"
                            className="h-14 w-full cursor-pointer rounded-2xl border-[#E2E6F2] text-base font-semibold text-[#14162B] hover:bg-[#F4F6FB]"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="mr-2 h-5 w-5" aria-hidden="true"/>
                            {translations?.mainPage.pageError.back}
                        </Button>
                    </div>
                </section>

                {stack && (
                    <pre
                        className="w-full overflow-x-auto rounded-2xl border border-[#E2E6F2] bg-white p-4 text-sm text-[#4A4F68]">
                        <code>{stack}</code>
                    </pre>
                )}
            </main>

            <Footer/>
        </div>
    );
}