"use server";

import { auth } from "@/lib/nextauth";
import { db } from "@/lib/prisma";
import { isUserBlock } from "@/store/userBlock";

export const addUserBlock = async (targetUserId: string) => {
    const currentUser = await auth();
    if (!currentUser) {
        return { error: "セッション情報がありません" };
    }
    const isBlocked = await isUserBlock({
        blockingUserId: currentUser.id,
        blockedUserId: targetUserId,
    });

    // すでにブロックしている場合
    if (isBlocked) {
        return { error: "すでにブロックしています。" };
    }

    await db.userBlock.create({
        data: {
            blockingUserId: currentUser.id,
            blockedUserId: targetUserId,
        },
    });
    return { success: "ok" };
};
