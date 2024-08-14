import * as z from 'zod';
import { MessageType } from "@prisma/client";

export const MessageInputSchema = z.object({
    content: z
        .string()
        .min(1, { message: "Content is required!" })
        .max(1000, { message: "Content must be 1000 characters or less." }),
    type: z.nativeEnum(MessageType),
});

export const RegisterSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required!"
    }),
    email: z.string().email({
        message: "Email is invalid!"
    }),
    password: z.string().min(1, {
        message: "Password is required!"
    }),
    image: z.string().min(1, {
        message: "Image is required!"
    })
});

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is invalid!"
    }),
    password: z.string().min(1, {
        message: "Password is required!"
    })
});
