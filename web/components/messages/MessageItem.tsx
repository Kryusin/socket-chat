"use client";

import React from "react";
import { format, isToday } from "date-fns";
import { ja } from "date-fns/locale";

import { UserAvatar } from "@/components/UserAvatar";

import { MessageWithSafeUser } from "@/types/prisma";
import { cn } from "@/lib/utils";
import { MessageType } from "@prisma/client";

import { MessageLinkCard } from "./MessageLinkCard";

function formatDate(date: Date) {
    const timeFormat = "H:mm";
    const dayFormat = "M/d(eee)";

    const time = format(date, timeFormat, { locale: ja });
    if (isToday(date)) {
        return { time };
    }
    const day = format(date, dayFormat, { locale: ja });
    return { day, time };
}

type MessageItemProps = {
    currentUserId: string;
    message: MessageWithSafeUser;
};

export const MessageItem = ({ currentUserId, message }: MessageItemProps) => {
    const isAuthorCurrentUser = message.author.id === currentUserId;
    const formattedDate = formatDate(message.createdAt);

    return (
        <div
            className={cn(
                "flex gap-x-1 mt-8 items-end",
                isAuthorCurrentUser && "flex-row-reverse justify-start"
            )}
        >
            {!isAuthorCurrentUser && <UserAvatar image={message.author.image} />}
            {message.messageType === MessageType.TEXT && (
                <div
                    className={cn(
                        "py-1 px-6 rounded-3xl max-w-[75%]",
                        isAuthorCurrentUser ? "bg-emerald-200/70" : "bg-gray-200/70"
                    )}
                >
                    {message.content}
                </div>
            )}
            {message.messageType === MessageType.LINK && (
                <>
                    <MessageLinkCard url={message.content} />
                </>
            )}
            <div
                className={cn(
                    "text-xs text-zinc-500",
                    isAuthorCurrentUser && "text-right"
                )}
            >
                <div className="">{formattedDate.day}</div>
                <div>{formattedDate.time}</div>
            </div>
        </div>
    );
};
