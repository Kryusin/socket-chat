"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Loader2, UserRoundCheck, UserRoundX } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { useManageBlockModal } from "@/hooks/useManageBlockModal";

import { SafeUser } from "@/types/prisma";
import { fetchBlockedUsers } from "@/actions/fetchBlockedUsers";
import { cn } from "@/lib/utils";
import { toggleUserBlock } from "@/actions/toggleUserBlock";

type BlockedUser = SafeUser & { blocked: boolean };

export const ManageBlockModal = () => {
    const { isOpen, onClose } = useManageBlockModal();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingId, setIsLoadingId] = useState<string[]>([]);
    const [users, setUsers] = useState<BlockedUser[]>([]);

    useEffect(() => {
        const getUsers = async () => {
            setIsLoading(true);
            try {
                const res = await fetchBlockedUsers();
                if (res.error) {
                    toast({
                        variant: "destructive",
                        title: "サーバーエラー",
                        description: res.error,
                    });
                    return;
                }

                if (res.blockedUsers) {
                    setUsers(res.blockedUsers);
                }
            } catch (error) {
                console.error(error);
                toast({
                    variant: "destructive",
                    title: "サーバーエラー",
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            getUsers();
        }
    }, [isOpen]);

    const toggleBlock = async (targetUser: BlockedUser) => {
        setIsLoadingId((prevState) => [...prevState, targetUser.id]);
        try {
            const res = await toggleUserBlock(targetUser.id);
            if (res.error) {
                toast({
                    variant: "destructive",
                    title: "エラー",
                    description: res.error,
                });
                return;
            }

            setUsers((prevUsers) =>
                prevUsers.map((user) => {
                    if (user.id === targetUser.id) {
                        return { ...user, blocked: !user.blocked };
                    }
                    return user;
                })
            );
        } catch (error) {
        } finally {
            setIsLoadingId((prevState) =>
                prevState.filter((id) => id !== targetUser.id)
            );
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white pb-12 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        ブロックユーザー
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        ブロックを解除することができます
                    </DialogDescription>
                </DialogHeader>
                {isLoading ? (
                    <div className="flex justify-center my-4">
                        <Loader2 className="animate-spin w-12 h-12" />
                    </div>
                ) : (
                    <ScrollArea className="mt-8 max-h-[420px] md:px-6">
                        <div>
                            {users.map((user, idx) => (
                                <Fragment key={`block-user-${user.id}`}>
                                    <div className="p-2 flex items-center justify-between hover:bg-gray-100 rounded-lg cursor-default">
                                        <div className="flex items-center space-x-2">
                                            {user.blocked ? (
                                                <UserRoundX className="w-5 h-5 font-bold text-red-500" />
                                            ) : (
                                                <UserRoundCheck className="w-5 h-5 font-bold text-emerald-500" />
                                            )}

                                            <div className="text-md">{user.name}</div>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => toggleBlock(user)}
                                                disabled={isLoadingId.includes(user.id)}
                                                className={cn(
                                                    "text-xs  rounded-lg px-2 py-1 text-white",
                                                    user.blocked
                                                        ? "bg-red-500 hover:bg-red-600"
                                                        : "bg-emerald-400 hover:bg-emerald-500",
                                                    isLoadingId.includes(user.id) &&
                                                    "cursor-not-allowed bg-opacity-70"
                                                )}
                                            >
                                                {user.blocked ? "ブロック解除する" : "ブロックする"}
                                            </button>
                                        </div>
                                    </div>
                                    {idx !== users.length - 1 && <Separator className="my-2" />}
                                </Fragment>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </DialogContent>
        </Dialog>
    );
};
