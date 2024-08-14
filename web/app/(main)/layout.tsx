import React from "react";

import { Sidebar } from "@/components/navigation/Sidebar";

type LayoutProps = {
    children: React.ReactNode;
};

const MainLayout = ({ children }: LayoutProps) => {
    return (
        <div className="w-full h-full">
            <aside className="hidden md:block fixed w-64 inset-y-0 z-30">
                <Sidebar />
            </aside>
            <main className="md:pl-64 h-full">{children}</main>
        </div>
    )
}

export default MainLayout;
