import React from "react";
import type { Metadata } from "next";
import { auth } from "@/lib/nextAuth";
import { redirect } from "next/navigation";
import { LOGIN_SUCCESS_REDIRECT } from "@/routes";

export const metadata: Metadata = {
    title: "Authorization"
}

type LayoutProps = {
    children: React.ReactNode;
}

const AuthLayout = async ({ children }: LayoutProps) => {
    const currentUser = await auth();
    if (currentUser) {
        redirect(LOGIN_SUCCESS_REDIRECT);
    }
    return (
        <div className="h-full flex md:item-center justify-center">{children}</div>
    )
}

export default AuthLayout;
