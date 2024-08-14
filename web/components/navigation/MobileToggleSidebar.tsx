"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/navigation/Sidebar";

export const MobileToggleSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger asChild className="grow-0">
                <Button variant="ghost" size="icon" className="md:hidden">
                    <ChevronRight className="w-8 h-8 text-zinc-200/70" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-0 w-[288px]">
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
};
