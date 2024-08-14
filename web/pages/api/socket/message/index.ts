import { NextApiRequest } from "next";

import { db } from "@/lib/prisma";
import { type NextApiResponseWithSocket } from "@/types";
import { pageAuth } from "@/lib/nextauth";
import { MessageInputSchema } from "@/schemas";
import { getThreadById } from "@/store/thread";
import { convertSafeUser } from "@/store/user";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseWithSocket
) {
    const currentUser = await pageAuth(req, res);
    if (!currentUser) {
        return res.status(401).json({ error: "無効なセッションです" });
    }

    const { values, threadId } = req.body;

    const validatedField = MessageInputSchema.safeParse(values);
    if (!validatedField.success) {
        return res.status(400).json({ error: "不正な値です" });
    }
    const { content, type } = validatedField.data;

    if (!threadId || typeof threadId !== "string") {
        return res.status(400).json({ error: "不正な値です" });
    }

    const thread = await getThreadById(threadId);
    if (!thread) {
        return res.status(400).json({ error: "不正な値です" });
    }

    if (thread.user1Id !== currentUser.id && thread.user2Id !== currentUser.id) {
        return res.status(400).json({ error: "不正な値です" });
    }

    const rawMessage = await db.message.create({
        data: {
            content,
            messageType: type,
            threadId: thread.id,
            authorId: currentUser.id,
        },
        include: {
            author: true,
        },
    });

    const convertedMessage = {
        ...rawMessage,
        author: convertSafeUser(rawMessage.author),
    };

    const roomKey = `thread:${thread.id}`;
    const messageKey = `thread:${thread.id}:message`;

    // ここでSocket.IOを使用してメッセージを送信しています。
    res.socket.server.io?.to(roomKey).emit(messageKey, convertedMessage);

    return res.status(200).json({ message: "ok" });
}
