import { db } from "@/lib/prisma";

export const retrieveAndDeleteSocketAuthToken = async (token: string) => {
    return db.$transaction(async (prisma) => {
        const socketAuthToken = await prisma.socketAuthToken.findUnique({
            where: { token },
        });
        if (socketAuthToken) {
            await prisma.socketAuthToken.delete({
                where: {
                    token,
                },
            });
        }

        return socketAuthToken;
    });
};
