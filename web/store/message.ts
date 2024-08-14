import { db } from "@/lib/prisma";
import { convertSafeUser } from "./user";

export const getMessagesByThreadId = async ({
    threadId,
    batchSize,
    cursor,
}: {
    threadId: string;
    batchSize: number;
    cursor?: string;
}) => {
    if (cursor) {
        const messages = await db.message.findMany({
            take: batchSize,
            skip: 1,
            cursor: {
                id: cursor,
            },
            where: {
                threadId,
            },
            include: {
                author: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return messages.map((message) => {
            return {
                ...message,
                author: convertSafeUser(message.author),
            };
        });
    }

    const messages = await db.message.findMany({
        take: batchSize,
        where: {
            threadId,
        },
        include: {
            author: true,
        },
        orderBy: { createdAt: "desc" },
    });
    return messages.map((message) => {
        return {
            ...message,
            author: convertSafeUser(message.author),
        };
    });
};
