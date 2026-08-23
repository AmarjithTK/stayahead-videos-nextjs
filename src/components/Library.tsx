"use client";

import { useMemo, useState } from "react";
import {
  CATEGORY_LABELS,
  playlists,
  videos,
  thumbnailFor,
} from "@/data/library";
import Card, { type CardItem } from "./Card";

type Tab = "playlists" | "videos";

export default function Library() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [tab, setTab] = useState<Tab>("playlists");
  const [pick, setPick] = useState<CardItem | null>(null);

  const allItems = useMemo<CardItem[]>(
    () => [
      ...playlists.map((p) => ({
        kind: "playlists" as const,
        id: p.id,
        title: p.title,
        url: p.url,
        channel: p.channel,
        category: p.category,
        tags: p.tags ?? [],
        thumbnail: p.firstVideoId ? thumbnailFor(p.firstVideoId) : undefined,
      })),
      ...videos.map((v) => ({
        kind: "videos" as const,
        id: v.id,
        title: v.title,
        url: v.url,
        channel: v.channel,
        category: v.category,
        tags: v.tags ?? [],
        thumbnail: thumbnailFor(v.videoId),
      })),
    ],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allItems.filter((item) => {
      if (item.kind !== tab) return false;
      if (activeCategory !== "all" && item.category !== activeCategory) return false;
      if (!q) return true;
      return [item.title, item.channel, ...item.tags]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [allItems, query, activeCategory, tab]);

  const categoryChips = useMemo(() => {
    const cats = new Set<string>();
    for (const item of allItems) {
      if (item.kind === tab) cats.add(item.category);
    }
    return Array.from(cats);
  }, [allItems, tab]);

  function pickRandom() {
    if (filtered.length === 0) return;
    setPick(filtered[Math.floor(Math.random() * filtered.length)]);
  }

  function switchTab(next: Tab) {
    setTab(next);
    setActiveCategory("all");
    setQuery("");
  }

  return (
    <main className="w-full flex-1 pb-16">
      <header className="sticky top-0 z-10 border-b border-zinc-200/70 bg-zinc-50/95 backdrop-blur-md dark:border-zinc-800/70 dark:bg-zinc-950/95">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <svg viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
              </svg>
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 shadow-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50" />
            </div>
            <button type="button" onClick={pickRandom} disabled={filtered.length === 0} className="flex shrink-0 items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path d="M13.5 4.5a2.5 2.5 0 1 1 .885 1.907l-6.53 3.265a2.5 2.5 0 0 1 0 .656l6.53 3.265A2.5 2.5 0 1 1 14 15a2.5 2.5 0 0 1-4.783-1.077L2.687 10.66a2.5 2.5 0 1 1 0-1.32l6.53-3.264A2.5 2.5 0 0 1 13.5 4.5Z" /></svg>
              Pick for me
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {([ ["playlists", "Playlists"], ["videos", "Videos"] ] as const).map(([key, label]) => (
              <button key={key} type="button" onClick={() => switchTab(key)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${tab === key ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900" : "text-zinc-600 hover:bg-zinc-200/60 dark:text-zinc-300 dark:hover:bg-zinc-800"}`}>{label}</button>
            ))}
            <span className="mx-1 h-5 w-px bg-zinc-300 dark:bg-zinc-700" />
            <button type="button" onClick={() => setActiveCategory("all")} className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${activeCategory === "all" ? "bg-red-600 text-white" : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"}`}>All</button>
            {categoryChips.map((cat) => (
              <button key={cat} type="button" onClick={() => setActiveCategory(cat)} className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${activeCategory === cat ? "bg-red-600 text-white" : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"}`}>{CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}</button>
            ))}
          </div>
        </div>
      </header>

      {filtered.length > 0 ? (
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((item) => <Card key={`${item.kind}-${item.id}`} item={item} />)}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <p className="text-lg font-medium text-zinc-700 dark:text-zinc-200">Nothing here</p>
          <button type="button" onClick={() => { setQuery(""); setActiveCategory("all"); }} className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">Clear filters</button>
        </div>
      )}

      {pick && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setPick(null)}>
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
              <span className="text-sm font-semibold uppercase tracking-wide text-red-600">Watch this</span>
              <button type="button" onClick={() => setPick(null)} aria-label="Close" className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"><span aria-hidden="true">X</span></button>
            </div>
            <a href={pick.url} target="_blank" rel="noopener noreferrer" className="block">
              <div className="aspect-video w-full bg-zinc-900">{pick.thumbnail && <img src={pick.thumbnail} alt="" className="h-full w-full object-cover" />}</div>
              <div className="px-5 py-4"><h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{pick.title}</h3><p className="mt-1 text-sm text-zinc-400">{pick.channel}</p></div>
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
