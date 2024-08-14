"use client";

import React from "react";

import { Badge } from "@/components/ui/badge";

import { usePartnerStatus } from "@/hooks/usePartnerStatus";
import { useStatusSocket } from "@/hooks/useStatusSocket";

type PartnerStatusIconProps = {
    currentUserId: string;
};

export const PartnerStatusIcon = ({
    currentUserId,
}: PartnerStatusIconProps) => {
    const { status, onChange } = usePartnerStatus();
    useStatusSocket({ currentUserId });

    if (status) {
        return (
            <Badge
                variant="outline"
                className="bg-red-500 text-white border-none grow-0 text-xs"
                onClick={() => onChange(!status)}
            >
                Active
            </Badge>
        );
    }

    return (
        <Badge
            variant="outline"
            className="bg-gray-500 text-white border-none grow-0 text-xs"
            onClick={() => onChange(!status)}
        >
            Off
        </Badge>
    );
};
