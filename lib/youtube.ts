// lib/youtube.ts
// Helper para obtener videos completos desde la API de YouTube.

import { cache } from "react";

type YTVideoItem = {
  id: string;
  snippet: {
    publishedAt: string;
    title: string;
    description: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
      maxres?: { url: string };
    };
    channelTitle?: string;
    liveBroadcastContent?: string;
  };
  liveStreamingDetails?: {
    actualStartTime?: string;
    actualEndTime?: string;
  };
};

/* ======================================================
   🔹 FETCH CON CACHE CONTROLADO
====================================================== */
async function fetchJson(url: string) {
  const res = await fetch(url, {
    next: { revalidate: 900 }, // 15 min
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`YouTube API error ${res.status}: ${txt}`);
  }
  return res.json();
}

/* ======================================================
   🔴 LIVE ACTIVO (HERO)
====================================================== */
export const getLiveNow = cache(async (): Promise<YTVideoItem[]> => {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
  if (!API_KEY || !CHANNEL_ID) return [];

  const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  searchUrl.searchParams.set("key", API_KEY);
  searchUrl.searchParams.set("channelId", CHANNEL_ID);
  searchUrl.searchParams.set("part", "id,snippet");
  searchUrl.searchParams.set("eventType", "live");
  searchUrl.searchParams.set("type", "video");
  searchUrl.searchParams.set("maxResults", "2");

  const searchJson = await fetchJson(searchUrl.toString());

  const ids = (searchJson.items || [])
    .map((i: any) => i.id?.videoId)
    .filter(Boolean);

  if (!ids.length) return [];

  const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
  videosUrl.searchParams.set("key", API_KEY);
  videosUrl.searchParams.set("part", "snippet,liveStreamingDetails");
  videosUrl.searchParams.set("id", ids.join(","));

  const videosJson = await fetchJson(videosUrl.toString());
  return videosJson.items || [];
});

/* ======================================================
   🔹 ÚLTIMOS VIDEOS DEL CANAL
====================================================== */
export const getLatestVideos = cache(
  async (maxResults = 24): Promise<YTVideoItem[]> => {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
    if (!API_KEY || !CHANNEL_ID) return [];

    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.searchParams.set("key", API_KEY);
    searchUrl.searchParams.set("channelId", CHANNEL_ID);
    searchUrl.searchParams.set("part", "id,snippet");
    searchUrl.searchParams.set("order", "date");
    searchUrl.searchParams.set("type", "video");
    searchUrl.searchParams.set("maxResults", String(maxResults));

    const searchJson = await fetchJson(searchUrl.toString());

    const ids = (searchJson.items || [])
      .map((i: any) => i.id?.videoId)
      .filter(Boolean);

    if (!ids.length) return [];

    const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    videosUrl.searchParams.set("key", API_KEY);
    videosUrl.searchParams.set("part", "snippet,liveStreamingDetails");
    videosUrl.searchParams.set("id", ids.join(","));

    const videosJson = await fetchJson(videosUrl.toString());

    return (videosJson.items || []).sort(
      (a: any, b: any) =>
        new Date(b.snippet.publishedAt).getTime() -
        new Date(a.snippet.publishedAt).getTime()
    );
  }
);

/* ======================================================
   🔴 TRANSMISIONES PASADAS (ORDEN REAL)
====================================================== */
export const getPastLiveStreams = cache(
  async (max = 6): Promise<YTVideoItem[]> => {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
    if (!API_KEY || !CHANNEL_ID) return [];

    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.searchParams.set("key", API_KEY);
    searchUrl.searchParams.set("channelId", CHANNEL_ID);
    searchUrl.searchParams.set("part", "id");
    searchUrl.searchParams.set("eventType", "completed");
    searchUrl.searchParams.set("type", "video");
    searchUrl.searchParams.set("order", "date");
    searchUrl.searchParams.set("maxResults", String(max * 3));

    const searchJson = await fetchJson(searchUrl.toString());

    const ids = (searchJson.items || [])
      .map((i: any) => i.id?.videoId)
      .filter(Boolean);

    if (!ids.length) return [];

    const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    videosUrl.searchParams.set("key", API_KEY);
    videosUrl.searchParams.set("part", "snippet,liveStreamingDetails");
    videosUrl.searchParams.set("id", ids.join(","));

    const videosJson = await fetchJson(videosUrl.toString());

    return (videosJson.items || [])
      .filter(
        (v: any) =>
          v.liveStreamingDetails?.actualEndTime &&
          v.liveStreamingDetails?.actualStartTime
      )
      .sort(
        (a: any, b: any) =>
          new Date(b.liveStreamingDetails.actualEndTime).getTime() -
          new Date(a.liveStreamingDetails.actualEndTime).getTime()
      )
      .slice(0, max);
  }
);

/* ======================================================
   🎤 PLAYLIST (ENTREVISTAS)
====================================================== */
export const getPlaylistVideos = cache(
  async (playlistId: string, max = 5): Promise<YTVideoItem[]> => {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    if (!API_KEY || !playlistId) return [];

    const playlistUrl = new URL(
      "https://www.googleapis.com/youtube/v3/playlistItems"
    );
    playlistUrl.searchParams.set("key", API_KEY);
    playlistUrl.searchParams.set("part", "snippet");
    playlistUrl.searchParams.set("playlistId", playlistId);
    playlistUrl.searchParams.set("maxResults", String(max));

    const json = await fetchJson(playlistUrl.toString());

    return (json.items || []).map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      snippet: item.snippet,
    }));
  }
);

/* ======================================================
   🎬 VIDEO POR ID
====================================================== */
export async function getVideoById(videoId: string) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  if (!API_KEY || !videoId) return null;

  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("key", API_KEY);
  url.searchParams.set("part", "snippet,liveStreamingDetails");
  url.searchParams.set("id", videoId);

  const res = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });

  if (!res.ok) return null;

  const data = await res.json();
  if (!data.items?.length) return null;

  return data.items[0];
}
