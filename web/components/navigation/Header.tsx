"use client";

import React from "react";

import { MobileToggleSidebar } from "./MobileToggleSidebar";

export const Header = () => {
    return (
        <header className="h-14 bg-emerald-400/90 text-white flex items-center space-x-2 px-2 w-full shadow-md">
            <MobileToggleSidebar />
            <h2 className="ml-4 font-semibold text-2xl">SockeChat</h2>
        </header>
    );
};
