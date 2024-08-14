"use server";

import { generateToken } from "@/lib/token";
import { auth } from "@/lib/nextauth";
import { db } from "@/lib/prisma";

export const generateSocketAuthToken = async () => {
    const currentUser = await auth();
    if (!currentUser) {
        return { error: "セッション情報がありません" };
    }

    const token = generateToken();

    const tenMinutesLater = new Date();
    tenMinutesLater.setMinutes(tenMinutesLater.getMinutes() + 10);

    await db.socketAuthToken.create({
        data: {
            userId: currentUser.id,
            token,
            expire: tenMinutesLater,
        },
    });

    return { token };
};
