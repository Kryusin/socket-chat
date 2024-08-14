import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchMessages } from "@/actions/fetchMessages";

type MessageQueryProps = {
    queryKey: string[];
    threadId: string;
};

export const useMessageQuery = ({ queryKey, threadId }: MessageQueryProps) => {
    const fetchMessagesQuery = async ({ pageParam }: { pageParam?: string }) => {
        const res = await fetchMessages({ threadId, cursor: pageParam });
        if (res.error) {
            throw new Error(res.error);
        }
        return res;
    };

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useInfiniteQuery({
            queryKey: queryKey,
            initialPageParam: undefined,
            queryFn: fetchMessagesQuery,
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            refetchInterval: false,
        });

    return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status };
};
