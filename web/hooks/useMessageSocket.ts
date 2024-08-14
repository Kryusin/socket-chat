import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/SocketProvider";

import { MessageWithSafeUser } from "@/types/prisma";

type MessageSocketProps = {
    queryKey: string[];
    threadId: string;
    currentUserId: string;
};

type PageData = {
    pages: { items: MessageWithSafeUser[]; nextCursor: string | null }[];
    pageParams: (string | undefined)[];
};

export const useMessageSocket = ({
    queryKey,
    threadId,
    currentUserId,
}: MessageSocketProps) => {
    const queryClient = useQueryClient();
    const { socket, isConnected } = useSocket();

    const addKey = `thread:${threadId}:message`;

    useEffect(() => {
        const handleError = (message: string) => {
            console.log("[SOCKET_ERROR]", message);
        };

        // thread:${threadId}:messageイベントが発火した場合の処理
        const handleMessage = (message: MessageWithSafeUser) => {
            // 送信されるデータは文字列形式なのでDateオブジェクトに変換する
            if (message) {
                message.createdAt = new Date(message.createdAt);
                message.updatedAt = new Date(message.updatedAt);
            }
            queryClient.setQueryData<PageData>(queryKey, (oldData) => {
                // メッセージがない場合、最初のページにメッセージを追加する
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return {
                        pages: [{ items: [message], nextCursor: null }],
                        pageParams: [undefined],
                    };
                }

                // pages[0]に受け取ったmessageを追加するための処理
                const pagesData = [...oldData.pages];
                pagesData[0] = {
                    ...pagesData[0],
                    items: [message, ...pagesData[0].items],
                };

                return { ...oldData, pages: pagesData };
            });
        };

        if (!isConnected || !socket) {
            return;
        }

        socket.emit("room:join", threadId);

        const handleBeforeUnload = () => {
            socket.emit("room:leave", threadId);
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        socket.on("error", handleError);
        socket.on(addKey, handleMessage);

        return () => {
            socket.emit("room:leave", threadId);
            socket.off(addKey, handleMessage);
            socket.off("error", handleError);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isConnected, queryKey, threadId, socket]);
};
