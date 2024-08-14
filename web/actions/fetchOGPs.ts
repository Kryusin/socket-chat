"use server";

import { load } from "cheerio";

export const fetchOGPs = async (urlString: string) => {
    let url: URL;
    try {
        url = new URL(urlString);
    } catch (error) {
        return { error: "invalid url" };
    }

    const res = await fetch(url);
    if (!res.ok) {
        console.error(
            `failed to fetching ogp data: ${res.status} ${res.statusText}`
        );
        return { error: res.statusText };
    }
    const text = await res.text();
    const $ = load(text);
    const title =
        $('meta[property="og:title"]').attr("content") || $("title").text();
    const image = $('meta[property="og:image"]').attr("content");
    const description = $('meta[property="og:description"]').attr("content");
    const href = $('meta[property="og:url"]').attr("content") ?? urlString;
    const domain = url.hostname;

    return { ogps: { title, image, description, href, domain } };
};
