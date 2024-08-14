"use client";

import React from "react";

import { MobileToggleSidebar } from "@/components/navigation/MobileToggleSidebar";

import { SafeUser } from "@/types/prisma";
import { PartnerStatusIcon } from "./PartnerStatusIcon";
import { UserBlockButton } from "@/components/UserBlockButton";

type MessageHeaderProps = {
    currentUserId: string;
    otherUser: SafeUser;
};

export const MessageHeader = ({ otherUser, currentUserId }: MessageHeaderProps) => {
    return (
        <header className="h-14 bg-emerald-400/90 text-white flex items-center justify-between space-x-2 px-2 w-full shadow-md">
            <div className="flex items-center space-x-2">
                <MobileToggleSidebar />
                <h2 className="ml-4 font-semibold text-2xl">@ {otherUser.name}</h2>
                <PartnerStatusIcon currentUserId={currentUserId} />
            </div>
            <div className="px-4">
                <UserBlockButton user={otherUser} />
            </div>
        </header>
    );
};
