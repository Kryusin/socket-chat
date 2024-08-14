"use client";

import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { io, Socket } from "socket.io-client";

import { generateSocketAuthToken } from "@/actions/generateSocketAuthToken";

type SocketContextType = {
    socket: Socket | null;
    isConnected: boolean;
    error: string | null;
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    error: null,
});

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const connectSocket = async () => {
            const res = await generateSocketAuthToken();
            if (res.error) {
                setError(res.error);
                return;
            }

            const serverUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

            const socketInstance = io(serverUrl, {
                path: "/api/socket/io",
                query: {
                    token: res.token,
                },
            });

            // Socket.IOサーバーに接続した場合、isConnectedをtrueに変更
            socketInstance.on("server:ready", () => {
                setIsConnected(true);
            });

            // Socket.IOサーバーから切断された場合、isConnectedをfalseに変更
            socketInstance.on("disconnect", (reason) => {
                console.log("Disconnected from the server.", reason);
                setIsConnected(false);
            });

            // messageイベントを受け取った場合、コンソールに出力する
            socketInstance.on("message", (message: string) => {
                console.log({ message });
            });

            // socketにsocketInstanceを保存します。
            setSocket(socketInstance);
        };
        connectSocket();
        return () => {
            socket?.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected, error }}>
            {children}
        </SocketContext.Provider>
    );
};
