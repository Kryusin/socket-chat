"use client"

import React, { useEffect, useState } from "react";

import { RegisterModal } from "../modals/RegisterModal";
import { ManageBlockModal } from "@/components/modals/ManageBlockModal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) return null;

    return (
        <>
            <ManageBlockModal />
            <RegisterModal />
        </>
    )
}
