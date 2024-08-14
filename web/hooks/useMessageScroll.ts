import { useEffect, useRef, useState } from "react";

type MessageScrollProps = {
    topRef: React.RefObject<HTMLDivElement>;
    bottomRef: React.RefObject<HTMLDivElement>;
    fetchNextPage: () => void;
    shouldLoadMore: boolean;
    pageCount: number;
    count: number;
};

export const useMessageScroll = ({
    topRef,
    bottomRef,
    fetchNextPage,
    shouldLoadMore,
    pageCount,
    count,
}: MessageScrollProps) => {
    // 初期化済みかどうかの状態
    const [isInitialized, setIsInitialized] = useState(false);
    // 次ページを読み込む前のスクロールの高さを保持するためのref
    const lastScrollHeight = useRef(0);

    // スクロールが一番上に到達した時のイベントを追加する
    useEffect(() => {
        const topDiv = topRef.current;
        if (!topDiv) return;

        const handleScroll = () => {
            const scrollTop = topDiv.scrollTop;

            // スクロールが一番上に到達した時に、追加のメッセージを読み込む
            // また、その時の要素の大きさを保存する
            if (scrollTop === 0 && shouldLoadMore) {
                lastScrollHeight.current = topDiv.scrollHeight;
                fetchNextPage();
            }
        };

        topDiv.addEventListener("scroll", handleScroll);
        return () => {
            topDiv.removeEventListener("scroll", handleScroll);
        };
    }, [topRef, shouldLoadMore]);

    // ページの読み込みが終わった時のイベントを定義
    // 読み込み後にスクロールの高さを読み込み前の位置に戻す
    useEffect(() => {
        const topDiv = topRef.current;
        if (topDiv && lastScrollHeight.current) {
            const newScrollHeight = topDiv.scrollHeight;
            topDiv.scrollTop = newScrollHeight - lastScrollHeight.current;
            lastScrollHeight.current = 0;
        }
    }, [topRef, pageCount]);

    // メッセージが追加された時のイベント。一番下へスクロールするようにする
    useEffect(() => {
        const bottomDiv = bottomRef.current;
        const topDiv = topRef.current;

        const shouldAutoScroll = () => {
            if (!isInitialized && bottomDiv) {
                setIsInitialized(true);
                return true;
            }
            if (!topDiv) {
                return false;
            }
            return true;
        };

        if (shouldAutoScroll()) {
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({
                    behavior: "smooth",
                });
            }, 100);
        }
    }, [bottomRef, topRef, isInitialized, count]);
};
