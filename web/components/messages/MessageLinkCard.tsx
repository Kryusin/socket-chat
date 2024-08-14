"use client";

import React, { useEffect, useState } from "react";
import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";

import { fetchOGPs } from "@/actions/fetchOGPs";

type MessageLinkCardProps = {
    url: string;
};

type OgpObjects = {
    href?: string;
    image?: string;
    title?: string;
    description?: string;
    domain?: string;
};

export const MessageLinkCard = ({ url }: MessageLinkCardProps) => {
    const [ogps, setOgps] = useState<OgpObjects>({});

    useEffect(() => {
        const fetchMetadata = async () => {
            const res = await fetchOGPs(url);
            if (res.error) {
                console.log(res.error);
            }
            if (res.ogps) {
                setOgps(res.ogps);
            }
        };
        fetchMetadata();
    }, []);

    if (!ogps) {
        return <SkeletonLinkItem />;
    }

    return (
        <div className="inline hover:scale-[1.02] transition rounded-xl shadow-lg">
            <Link rel="noopener noreferrer" href={ogps.href ?? "/"}>
                <div className="flex flex-col md:flex-row">
                    <img
                        src={ogps.image ?? "/no-image.jpeg"}
                        className="object-cover w-[200px] h-[200px] md:w-[150px] md:h-[150px] rounded-t-xl md:rounded-r-none md:rounded-l-xl"
                        alt="image"
                    />
                    <div className="w-[200px] md:w-[400px] md:h-[150px] bg-white rounded-b-xl md:rounded-l-none md:rounded-r-xl flex flex-col p-4">
                        <h6 className="line-clamp-2 text-sm mb-2 font-semibold shrink-0 grow-0">
                            {ogps.title}
                        </h6>
                        <p className="hidden md:line-clamp-3 text-xs text-zinc-500 ">
                            {ogps.description}
                        </p>
                        <p className="shrink-0 text-xs pt-2 text-zinc-500 grow-0 flex items-center justify-start md:justify-end space-x-1 truncate">
                            <LinkIcon className="w-4 h-4" />
                            <span>{ogps.domain}</span>
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export const SkeletonLinkItem = () => {
    return (
        <div className="inline hover:scale-[1.02] transition">
            <div className="flex flex-col md:flex-row">
                <div className="bg-white w-[200px] h-[200px] rounded-t-xl md:rounded-r-none md:rounded-l-xl p-4">
                    <Skeleton className="w-full h-full" />
                </div>
                <div className="w-[200px] md:w-[400px] md:h-[200px] bg-white rounded-b-xl md:rounded-l-none md:rounded-r-xl  flex flex-col p-4 gap-y-4">
                    <Skeleton className="w-full h-6" />
                    <div className="hidden md:flex flex-col gap-y-2 grow">
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                    </div>
                    <div className="shrink-0 text-sm flex items-center justify-start md:justify-end space-x-1 ">
                        <LinkIcon className="w-4 h-4" />
                        <Skeleton className="w-2/3 h-4" />
                    </div>
                </div>
            </div>
        </div>
    );
};
