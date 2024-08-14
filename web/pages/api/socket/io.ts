import { NextApiRequest } from "next";
import { Socket, Server as SocketIOServer } from "socket.io";
import { Server as NetServer } from "http";

import { type NextApiResponseWithSocket } from "@/types";
import { retrieveAndDeleteSocketAuthToken } from "@/store/socketAuthToken";
import { getThreadById } from "@/store/thread";
import { userActivate, userDeactivate, userIsActive } from "./user";

// Next.jsによる自動解析を無効
export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = async (
    req: NextApiRequest,
    res: NextApiResponseWithSocket
) => {
    if (res.socket.server.io) {
        res.send("socket server is already running");
        return;
    }

    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server;
    const io = new SocketIOServer(httpServer, { path: path });

    // ユーザーがSocket.IOに接続した場合のアクション
    io.on("connection", async (socket: Socket) => {
        const token = socket.handshake.query.token;

        if (typeof token !== "string") {
            console.log("invalid token");
            socket.disconnect(true);
            return;
        }

        const socketAuthToken = await retrieveAndDeleteSocketAuthToken(token);
        const now = new Date();
        if (!socketAuthToken || socketAuthToken.expire < now) {
            console.log("token is expired");
            socket.disconnect(true);
            return;
        }

        // socketにuserIdを登録します。
        socket.userId = socketAuthToken.userId;

        // messageイベントが発生した場合のアクション
        socket.on("message", (message: any) => {
            console.log({ message });
            // クライアントのsocketにmessageイベントを発生させます。
            socket.emit("message", "Hello, world! by server");

            // room:joinイベントが発生した場合のアクション
            // クライアントが特定のチャットルームに参加しようとする時にこのイベントが発火されます。
            socket.on("room:join", async (threadId: string) => {
                const thread = await getThreadById(threadId);
                if (!thread) {
                    socket.emit("error", "不正なIDです");
                    return;
                }

                // クライアントがスレッドの参加者でない場合、エラメッセージを返します。
                if (
                    thread.user1Id !== socket.userId &&
                    thread.user2Id !== socket.userId
                ) {
                    socket.emit("error", "権限がありません");
                    return;
                }

                const roomKey = `thread:${thread.id}`;

                // クライアントがまだそのルームに参加していなければ、ルームに参加させます。
                if (!socket.rooms.has(roomKey)) {
                    socket.join(roomKey);
                }

                // ルームの自分以外のメンバーに参加を伝える
                socket
                    .to(roomKey)
                    .emit("user:status:change", { isOnline: true, userId: socket.userId });

                // 自分の状態をアクティブにする
                userActivate(`${threadId}:${socket.userId}`);

                const partnerUserId =
                    thread.user1Id === socket.userId ? thread.user2Id : thread.user1Id;
                const partnerIsActive = userIsActive(`${threadId}:${partnerUserId}`);
                if (partnerIsActive) {
                    socket.emit("user:status:change", {
                        isOnline: true,
                        userId: partnerUserId,
                    });
                }
            });

            // room:leaveイベントが発生した場合のアクション
            // クライアントが特定のチャットルームから退出する時にこのイベントが発火されます。
            socket.on("room:leave", (threadId: string) => {
                const roomKey = `thread:${threadId}`;

                socket
                    .to(roomKey)
                    .emit("user:status:change", { isOnline: false, userId: socket.userId });
                userDeactivate(`${threadId}:${socket.userId}`);
                // クライアントをそのルームから退出させます
                socket.leave(roomKey);
            });

            socket.emit("server:ready");
        });
    });

    res.socket.server.io = io;

    res.end();
};

export default ioHandler;
