import { db } from "@/lib/prisma";

export const getThreadById = async (id: string) => {
    const thread = await db.thread.findUnique({
        where: { id },
    });
    return thread;
};

export const getOrCreateThread = async (user1Id: string, user2Id: string) => {
    const [sortedUser1Id, sortedUser2Id] = [user1Id, user2Id].sort();

    const existingThread = await db.thread.findUnique({
        where: {
            user1Id_user2Id: { user1Id: sortedUser1Id, user2Id: sortedUser2Id },
        },
    });
    if (existingThread) return existingThread;

    const thread = await db.thread.create({
        data: {
            user1Id: sortedUser1Id,
            user2Id: sortedUser2Id,
        },
    });
    return thread;
};
