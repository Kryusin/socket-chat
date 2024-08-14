import { useSocket } from "@/components/providers/SocketProvider";
import { useEffect } from "react";
import { usePartnerStatus } from "./usePartnerStatus";

type StatusSocketProps = {
    currentUserId: string;
};

type StatusChangeParams = {
    userId: string;
    isOnline: boolean;
};

export const useStatusSocket = ({ currentUserId }: StatusSocketProps) => {
    const { socket, isConnected } = useSocket();
    const { onChange } = usePartnerStatus();

    const statusKey = "user:status:change";

    useEffect(() => {
        if (!socket || !isConnected) return;

        const handleStatusChange = ({ isOnline, userId }: StatusChangeParams) => {
            if (userId === currentUserId) {
                return;
            }
            onChange(isOnline);
        };

        socket.on(statusKey, handleStatusChange);

        return () => {
            onChange(false);
            socket.off(statusKey, handleStatusChange);
        };
    }, [socket, isConnected, onChange, currentUserId]);
};
