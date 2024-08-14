"use client"

import { useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface EmojiPickerProps {
    onChange: (value: string) => void;
    value: string;
}

export const EmojiPicker = ({ onChange, value }: EmojiPickerProps) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex items-center space-x-4">
            <span className="text-4xl">{value}</span>
            <Popover
                open={open}
                onOpenChange={setOpen}
            >
                <PopoverTrigger>
                    <Button
                        asChild
                        variant="outline"
                    >
                        <p>アバターを変更する</p>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    side="bottom"
                    sideOffset={0}
                    className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
                >
                    <Picker
                        data={data}
                        onEmojiSelect={(emoji: any) => {
                            onChange(emoji.native);
                            setOpen(false);
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
