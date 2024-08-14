"use client";

import { useSocket } from "@/components/providers/SocketProvider";
import React, { useEffect } from "react";

const TokenPage = () => {
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.on("message", (message: any) => {
            console.log({ message });
        });
    });

    const handleClick = () => {
        if (!socket) {
            console.log("socket is null");
            return;
        }
        socket.emit("message", "Hello, world! by Client");
    };

    return (
        <div>
            <button onClick={handleClick}>Click</button>
        </div>
    );
};

export default TokenPage;
