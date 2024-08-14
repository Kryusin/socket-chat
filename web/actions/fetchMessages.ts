"use server";

import { auth } from "@/lib/nextauth";
import { getMessagesByThreadId } from "@/store/message";
import { getThreadById } from "@/store/thread";

type IParams = {
    threadId: string;
    cursor?: string;
};

const MESSAGE_BATCH = 20;

export const fetchMessages = async ({ threadId, cursor }: IParams) => {
    const currentUser = await auth();
    if (!currentUser) {
        return { error: "セッション情報がありません" };
    }

    const thread = await getThreadById(threadId);
    if (!thread) {
        return { error: "スレッド情報がありません" };
    }
    if (thread.user1Id !== currentUser.id && thread.user2Id !== currentUser.id) {
        return { error: "権限がありません" };
    }

    const messages = await getMessagesByThreadId({
        threadId: thread.id,
        batchSize: MESSAGE_BATCH,
        cursor,
    });

    let nextCursor = null;
    if (messages.length === MESSAGE_BATCH) {
        nextCursor = messages[MESSAGE_BATCH - 1].id;
    }
    return { items: messages, nextCursor };
};
