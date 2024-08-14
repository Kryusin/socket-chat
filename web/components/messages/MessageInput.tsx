"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoveUp } from "lucide-react";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { MessageInputSchema } from "@/schemas";
import { toast } from "@/components/ui/use-toast";
import { createMessage } from "@/actions/createMessage";
import { MessageType } from "@prisma/client";

function isValidUrl(str: string): boolean {
    const pattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name and extension
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
        "i"
    ); // fragment locator
    return !!pattern.test(str);
}

type MessageInputProps = {
    threadId: string;
};

export const MessageInput = ({ threadId }: MessageInputProps) => {
    const form = useForm<z.infer<typeof MessageInputSchema>>({
        resolver: zodResolver(MessageInputSchema),
        defaultValues: {
            content: "",
            type: MessageType.TEXT,
        },
    });
    const { errors: formErrors } = form.formState;
    const isSubmitting = form.formState.isSubmitting;

    useEffect(() => {
        if (formErrors.content) {
            toast({ variant: "destructive", title: formErrors.content.message });
        }
    }, [formErrors]);

    const onSubmit = async (values: z.infer<typeof MessageInputSchema>) => {
        const isUrl = isValidUrl(values.content);
        if (isUrl) {
            values.type = MessageType.LINK;
        }

        const res = await fetch("/api/socket/message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                values,
                threadId,
            }),
        });

        if (!res.ok) {
            toast({
                variant: "destructive",
                title: "エラー",
                description: res.statusText,
            });
        }

        form.reset();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="relative px-4 md:px-8 pt-2 pb-4"
            >
                <FormField
                    disabled={isSubmitting}
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl>
                                <Input
                                    placeholder="Message"
                                    autoComplete="off"
                                    {...field}
                                    className="h-12 pl-6 pr-12 text-base rounded-full focus:ring-0"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button
                    disabled={isSubmitting}
                    variant={"ghost"}
                    size={"icon"}
                    className="bg-emerald-400 hover:bg-emerald-500 rounded-full text-white hover:text-gray-100 font-bold absolute top-[14px] right-5 md:right-10"
                >
                    <MoveUp />
                </Button>
            </form>
        </Form>
    );
};
