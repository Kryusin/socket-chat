import { NextApiResponse } from "next";
import { Socket as SocketNet } from "net";
import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as NetServer } from "http";

export type NextApiResponseWithSocket = NextApiResponse & {
    socket: SocketNet & {
        server: NetServer & {
            io?: SocketIOServer;
        };
    };
};

// Socketインターフェースの拡張
declare module "socket.io" {
    interface Socket {
        userId?: string;
    }
}
