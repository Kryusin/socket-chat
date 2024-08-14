"use server";

import { auth } from "@/lib/nextauth";
import { db } from "@/lib/prisma";
import { isUserBlock } from "@/store/userBlock";

export const toggleUserBlock = async (targetUserId: string) => {
    const currentUser = await auth();
    if (!currentUser) {
        return { error: "セッション情報がありません" };
    }

    const isBlocked = await isUserBlock({
        blockingUserId: currentUser.id,
        blockedUserId: targetUserId,
    });

    if (isBlocked) {
        await db.userBlock.delete({
            where: {
                blockingUserId_blockedUserId: {
                    blockingUserId: currentUser.id,
                    blockedUserId: targetUserId,
                },
            },
        });
    } else {
        // UserBlockが存在しない（ブロックしていない）場合は、USerBlockを作成する
        await db.userBlock.create({
            data: {
                blockingUserId: currentUser.id,
                blockedUserId: targetUserId,
            },
        });
    }
    return { success: "ok" };
};
