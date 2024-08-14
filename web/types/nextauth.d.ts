import { UserRole } from '@prisma/client';
import NextAuth, { type DefaultSession } from 'next-auth/next';

export type SessionUser = {
    id: string;
    email: string;
    image: string;
    name: string;
};

declare module "next-auth" {
    interface Session {
        user: SessionUser;
    }
}
