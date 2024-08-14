"use server";

import { auth } from "@/lib/nextauth";
import { convertSafeUser, getBlockedUsers } from "@/store/user";

export const fetchBlockedUsers = async () => {
    const currentUser = await auth();
    if (!currentUser) {
        return { error: "セッション情報がありません" };
    }

    const rawBlockedUsers = await getBlockedUsers(currentUser.id);
    const blockedUsers = rawBlockedUsers.map((user) => {
        const safeUser = convertSafeUser(user);
        return { ...safeUser, blocked: true };
    });
    return { blockedUsers };
};
