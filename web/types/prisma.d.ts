import { User } from "@prisma/client";

type SafeUser = Omit<User, "password">;

type MessageWithSafeUser = Message & { author: SafeUser };
