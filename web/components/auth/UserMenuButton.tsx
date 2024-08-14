"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import { AlertTriangle, Loader2 } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";

import { useManageBlockModal } from "@/hooks/useManageBlockModal";

export const UserMenuButton = () => {
    const session = useSession();
    const { onOpen } = useManageBlockModal();

    if (session.status === "loading") {
        return (
            <div className="flex justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin" />
            </div>
        );
    }

    if (!session.data) {
        return (
            <div className="flex justify-center items-center">
                <AlertTriangle className="h-7 w-7 text-zinc-500 cursor-pointer" />
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
                <div className="flex items-center px-1 py-2 space-x-2 rounded-md text-zinc-700 hover:bg-zinc-200/70">
                    <UserAvatar image={session.data.user.image ?? ""} />
                    <div>メニュー</div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end">
                <DropdownMenuItem>
                    <Button
                        variant={"ghost"}
                        className="text-red-500 font-semibold"
                        onClick={() => signOut()}
                    >
                        サインアウト
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => onOpen()}
                    className="text-zinc-900 cursor-pointer"
                >
                    ブロック管理
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-red-500 cursor-pointer font-semibold"
                >
                    サインアウト
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu >
    );
};
