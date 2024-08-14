"use server";

import * as z from "zod";

import { db } from "@/lib/prisma";
import { MessageInputSchema } from "@/schemas";
import { auth } from "@/lib/nextauth";
import { getThreadById } from "@/store/thread";
import { convertSafeUser } from "@/store/user";

type IParams = {
    threadId: string;
    values: z.infer<typeof MessageInputSchema>;
};

export const createMessage = async ({ threadId, values }: IParams) => {
    const validatedField = MessageInputSchema.safeParse(values);
    console.log(validatedField)
    if (!validatedField.success) {
        return { error: "不正な値です" };
    }

    const { content } = validatedField.data;

    const currentUser = await auth();
    if (!currentUser) {
        return { error: "セッション情報がありません" };
    }

    const thread = await getThreadById(threadId);
    if (
        !thread ||
        (thread.user1Id !== currentUser.id && thread.user2Id !== currentUser.id)
    ) {
        return { error: "不正なスレッドです" };
    }

    const rawMessage = await db.message.create({
        data: {
            content,
            threadId,
            authorId: currentUser.id,
        },
        include: {
            author: true,
        },
    });
    if (!rawMessage) return null;

    const convertedMessage = {
        ...rawMessage,
        author: convertSafeUser(rawMessage.author),
    };
    return { message: convertedMessage };
};
