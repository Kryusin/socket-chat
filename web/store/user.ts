import { SafeUser } from '@/types/prisma';
import { db } from "@/lib/prisma";
import { User } from "@prisma/client";

export const getBlockedUsers = async (blockingUserId: string) => {
    const userBlocks = await db.userBlock.findMany({
        where: {
            blockingUserId,
        },
        include: {
            blocedUser: true,
        },
    });

    const user = userBlocks.map((block) => block.blocedUser);
    return user;
};

export const getUserByEmail = async (email: string) => {
    const user = await db.user.findUnique({
        where: { email },
    });
    return user;
};

export const getSafeUserById = async (id: string): Promise<SafeUser | null> => {
    const user = await db.user.findUnique({
        where: { id }
    });

    if (!user) return null;
    return convertSafeUser(user);
}

export const getSafeUsersByName = async (
    name?: string,
    ignoreId?: string
): Promise<SafeUser[]> => {
    const blockedUserResults = await db.userBlock.findMany({
        where: { blockingUserId: ignoreId },
        select: { blockedUserId: true },
    });

    const blockedUserIds = blockedUserResults.map((block) => block.blockedUserId);
    const users = await db.user.findMany({
        where: {
            name: {
                contains: name
            },
            id: {
                not: ignoreId,
                notIn: blockedUserIds,
            }
        }
    });
    const safeUsers = users.map((user) => convertSafeUser(user));
    return safeUsers;
}

export const convertSafeUser = (user: User): SafeUser => {
    const { password, ...safeUser } = user;
    return safeUser;
}
