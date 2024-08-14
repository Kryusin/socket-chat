"use client";

import React, { useState } from "react";
import { UserRoundX } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

import { SafeUser } from "@/types/prisma";
import { addUserBlock } from "@/actions/addUserBlock";

type UserBlockButtonProps = {
    user: SafeUser;
};

export const UserBlockButton = ({ user }: UserBlockButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleClick = async () => {
        setIsLoading(true);
        try {
            const res = await addUserBlock(user.id);
            if (res.error) {
                toast({
                    variant: "destructive",
                    title: "サーバーエラー",
                    description: res.error,
                });
                return;
            }

            router.refresh();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "サーバーエラー" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"icon"} className="hover:bg-gray-100">
                    <UserRoundX />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem
                    disabled={isLoading}
                    onClick={handleClick}
                    className="cursor-pointer"
                >
                    {user.name} をブロックする
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
