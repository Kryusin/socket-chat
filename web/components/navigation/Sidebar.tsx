"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Loader2, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/UserAvatar";
import { UserMenuButton } from "@/components/auth/UserMenuButton";

import { SafeUser } from "@/types/prisma";
import { fetchUsersByName } from "@/actions/fetchUsers";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
    const [users, setUsers] = useState<SafeUser[]>([]);
    const [value, setValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const getUsers = async () => {
            setIsLoading(true);
            try {
                const res = await fetchUsersByName(value);
                if (res.error) {
                    toast({
                        variant: "destructive",
                        title: "フェッチエラー",
                        description: res.error,
                    });
                    return;
                }
                if (res.users) {
                    setUsers(res.users);
                }
            } catch (error) {
                console.error("[DEBUG]" + error);
            } finally {
                setIsLoading(false);
            }
        };

        getUsers();
    }, [setIsLoading, value]);

    const handleInput = useDebouncedCallback((term) => {
        setValue(term);
    }, 500);

    return (
        <div className="w-full h-full bg-gray-100/70 border-zinc-300/20 border-r-2 flex flex-col">
            <div className="w-full relative h-14 flex items-center px-2 bg-emerald-400/90 border-b-2 border-zinc-300/20 shrink-0 grow-0">
                <Search className={"absolute top-4 left-4"} />
                <Input
                    onChange={(e) => {
                        handleInput(e.target.value);
                    }}
                    placeholder="search name..."
                    className="pl-10 bg-emerald-200/80 placeholder:text-zinc-500 focus:ring-0"
                />
            </div>
            <ScrollArea className="px-1 pb-4 grow">
                {isLoading ? (
                    <div className="flex justify-center items-center">
                        <Loader2 className="h-7 w-7 text-zinc-500 my-4 animate-spin" />
                    </div>
                ) : (
                    <>
                        {users.map((user) => (
                            <Link
                                href={`/thread/${user.id}`}
                                key={`user-${user.id}`}
                                className={cn(
                                    "flex items-center space-x-2 rounded-md p-2 mb-2  hover:bg-zinc-200/70 transition text-zinc-700",
                                    pathname.includes(user.id) && "bg-zinc-300/70"
                                )}
                            >
                                <UserAvatar image={user.image} />
                                <p>{user.name}</p>
                            </Link>
                        ))}
                    </>
                )}
            </ScrollArea>
            <div className="grow-0 shrink-0 px-2 pt-2 pb-4">
                <UserMenuButton />
            </div>
        </div >
    );
};
