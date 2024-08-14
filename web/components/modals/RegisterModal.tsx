"use client"

import React, { useState, useTransition } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/auth/FormError";
import { toast } from "@/components/ui/use-toast";

import { useRegisterModal } from "@/hooks/useRegisterModal";
import { RegisterSchema } from "@/schemas";
import { registerUser } from "@/actions/registerUser";

export const RegisterModal = () => {
    const { isOpen, onClose } = useRegisterModal()
    const [error, setError] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            image: "😀",
            password: "",
        }
    });

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        setError("");

        startTransition(async () => {
            try {
                const res = await registerUser(values);
                if (res.error) {
                    setError(res.error);
                }
                if (res.success) {
                    toast({ variant: "success", title: res.success });
                    handleClose();
                }
            } catch (error) {
                console.log(error);
                setError("アプリケーションエラー");
            }
        });
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={handleClose}
        >
            <DialogContent className="text-zinc-900">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        ユーザー登録
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        ユーザを登録しよう！
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Alice"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="user@example.com"
                                            type="email"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="password"
                                            type="password"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-4 w-full">
                            <FormError message={error} />
                            <Button
                                type="submit"
                                className="w-full space-x-2"
                                disabled={isPending}
                            >
                                {isPending && <Loader2 className="animate-spin" />}
                                <span>Register</span>
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
