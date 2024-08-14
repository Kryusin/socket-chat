"use client";

import React, { useRef } from "react";
import { Loader2 } from "lucide-react";

import { useMessageQuery } from "@/hooks/useMessageQuery";
import { useMessageScroll } from "@/hooks/useMessageScroll";
import { useMessageSocket } from "@/hooks/useMessageSocket";
import { MessageItem } from "./MessageItem";

type MessageListProps = {
    threadId: string;
    currentUserId: string;
};

export const MessageList = ({ threadId, currentUserId }: MessageListProps) => {
    const topRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const queryKey = ["thread", `thread:${threadId}`];

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useMessageQuery({ queryKey, threadId });
    useMessageScroll({
        topRef,
        bottomRef,
        fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        pageCount: data?.pages.length ?? 0,
        count: data?.pages[0].items?.length ?? 0,
    });
    useMessageSocket({ queryKey, threadId, currentUserId });

    if (status === "pending") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500">Loading messages...</p>
            </div>
        );
    }

    return (
        <div ref={topRef} className="flex flex-col flex-1 overflow-y-auto">
            {!hasNextPage && (
                <div className="flex justify-center text-zinc-500 text-sm p-2">
                    メッセージはありません
                </div>
            )}
            {hasNextPage && (
                <div className="flex flex-col justify-center items-center">
                    {isFetchingNextPage ? (
                        <>
                            <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                            <p className="text-xs text-zinc-500">Loading messages...</p>
                        </>
                    ) : (
                        <button
                            onClick={() => fetchNextPage()}
                            className="text-zinc-500 hover:text-zinc-600 text-xs my-4 transition"
                        >
                            次のメッセージ
                        </button>
                    )}
                </div>
            )}
            <div className="flex flex-col-reverse mt-auto px-2">
                {data?.pages.map((page, i) => (
                    <React.Fragment key={`page-${i}`}>
                        {page.items?.map((message, idx) => (
                            <MessageItem
                                key={`message:${message.id}`}
                                currentUserId={currentUserId}
                                message={message}
                            />
                        ))}
                    </React.Fragment>
                ))}
            </div>
            <div ref={bottomRef} />
        </div>
    );
};
