"use server"

import * as z from "zod";
import bcrypt from "bcrypt";

import { db } from "@/lib/prisma";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/store/user";

export const registerUser = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedField = RegisterSchema.safeParse(values);

    if (!validatedField.success) {
        return { error: "不正な値です" };
    }

    const { email, password, image, name } = validatedField.data;

    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return { error: "ユーザーは既に存在します" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                image,
            }
        });
        return { success: "ユーザー作成に成功しました" };
    } catch (error: any) {
        console.log("[REGISTER_USER", error);
        return { error: "サーバーエラー" }
    }
};
