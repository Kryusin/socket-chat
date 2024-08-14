import React from "react";
import { redirect } from "next/navigation";

import { MessageHeader } from "@/components/messages/MessageHeader";
import { MessageList } from "@/components/messages/MessageList";

import { auth } from "@/lib/nextauth";
import { getSafeUserById } from "@/store/user";
import { getOrCreateThread } from "@/store/thread";
import { LOGIN_REQUIRE_REDIRECT, LOGIN_SUCCESS_REDIRECT } from "@/routes";
import { MessageInput } from "@/components/messages/MessageInput";
import { isUserBlock } from "@/store/userBlock";

type MessagePageProps = {
    params: { userId: string };
};

const MessagePage = async ({ params }: MessagePageProps) => {
    const currentUser = await auth();
    if (!currentUser) {
        redirect(LOGIN_REQUIRE_REDIRECT);
    }

    const otherUserId = params.userId;

    const otherUser = await getSafeUserById(otherUserId);
    if (!otherUser) {
        redirect(LOGIN_SUCCESS_REDIRECT);
    }

    const isBlock = await isUserBlock({
        blockingUserId: currentUser.id,
        blockedUserId: otherUser.id,
    });
    if (isBlock) {
        redirect(LOGIN_SUCCESS_REDIRECT);
    }

    const thread = await getOrCreateThread(currentUser.id, otherUser.id);

    return (
        <div className="flex flex-col h-full">
            <MessageHeader currentUserId={currentUser.id} otherUser={otherUser} />
            <MessageList threadId={thread.id} currentUserId={currentUser.id} />
            <MessageInput threadId={thread.id} />
        </div>
    );
};

export default MessagePage;
