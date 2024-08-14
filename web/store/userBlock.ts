import { db } from "@/lib/prisma";

type IsUserBlockParams = {
    blockingUserId: string;
    blockedUserId: string;
};

export const isUserBlock = async ({
    blockingUserId,
    blockedUserId,
}: IsUserBlockParams) => {
    const userBlock = await db.userBlock.findUnique({
        where: {
            blockingUserId_blockedUserId: { blockingUserId, blockedUserId },
        },
    });

    return userBlock !== null;
};
