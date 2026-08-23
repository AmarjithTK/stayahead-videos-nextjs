"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CATEGORY_LABELS,
  playlists,
  videos,
  thumbnailFor,
} from "@/data/library";
import Card, { type CardItem } from "./Card";

type Tab = "playlists" | "videos" | "visited";
type Theme = "light" | "dark";

export default function Library() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [tab, setTab] = useState<Tab>("playlists");
  const [visitedIds, setVisitedIds] = useState<string[]>([]);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = window.localStorage.getItem("learntube-theme");
    const nextTheme: Theme = saved === "dark" ? "dark" : "light";
    // Apply the user's persisted preference after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("learntube-visited");
    if (!saved) return;
    try {
      const ids = JSON.parse(saved);
      if (Array.isArray(ids)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisitedIds(ids.filter((id): id is string => typeof id === "string"));
      }
    } catch {
      window.localStorage.removeItem("learntube-visited");
    }
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    window.localStorage.setItem("learntube-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }

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
      if (tab === "visited" ? !visitedIds.includes(item.id) : item.kind !== tab) {
        return false;
      }
      if (activeCategory !== "all" && item.category !== activeCategory) return false;
      if (!q) return true;
      return [item.title, item.channel, ...item.tags]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [allItems, query, activeCategory, tab, visitedIds]);

  const categoryChips = useMemo(() => {
    const cats = new Set<string>();
    for (const item of allItems) {
      if (tab === "visited" ? visitedIds.includes(item.id) : item.kind === tab) {
        cats.add(item.category);
      }
    }
    return Array.from(cats);
  }, [allItems, tab, visitedIds]);

  function switchTab(next: Tab) {
    setTab(next);
    setActiveCategory("all");
    setQuery("");
  }

  function markVisited(id: string) {
    setVisitedIds((current) => {
      const next = [id, ...current.filter((visitedId) => visitedId !== id)];
      window.localStorage.setItem("learntube-visited", JSON.stringify(next));
      return next;
    });
  }

  return (
    <main className="w-full flex-1 pb-16">
      <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-zinc-50/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-4 py-5 sm:px-6">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-sm font-bold text-white">YT</span>
              <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">LearnTube</span>
            </div>
            <button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900">
              {theme === "light" ? (
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path d="M10 2.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM10 16a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 10 16ZM17.75 10a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1 0-1.5h1A.75.75 0 0 1 17.75 10ZM4 10a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1 0-1.5h1A.75.75 0 0 1 4 10Zm11.303-5.303a.75.75 0 0 1 1.06 1.06l-.707.708a.75.75 0 1 1-1.06-1.061l.707-.707ZM5.404 14.596a.75.75 0 0 1 1.06 1.06l-.707.708a.75.75 0 0 1-1.06-1.061l.707-.707ZM15.657 15.657a.75.75 0 0 1-1.06 0l-.707-.708a.75.75 0 1 1 1.06-1.06l.707.707a.75.75 0 0 1 0 1.061ZM6.464 6.464a.75.75 0 0 1-1.06 0l-.707-.707a.75.75 0 1 1 1.06-1.06l.707.707a.75.75 0 0 1 0 1.06ZM10 6.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z" /></svg>
              ) : (
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path d="M16.5 12.4A6.75 6.75 0 0 1 7.6 3.5a6.75 6.75 0 1 0 8.9 8.9Z" /></svg>
              )}
            </button>
          </div>
          <div className="w-full max-w-2xl">
            <div className="relative flex-1">
              <svg viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
              </svg>
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses, topics, or channels" className="w-full rounded-2xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 shadow-[0_2px_10px_rgba(0,0,0,0.04)] outline-none transition-colors placeholder:text-zinc-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50" />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {([ ["playlists", "Playlists"], ["videos", "Videos"], ["visited", "Previous visited"] ] as const).map(([key, label]) => (
              <button key={key} type="button" onClick={() => switchTab(key)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${tab === key ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"}`}>{label}</button>
            ))}
            <span className="mx-2 h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
            <button type="button" onClick={() => setActiveCategory("all")} className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${activeCategory === "all" ? "bg-red-600 text-white" : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"}`}>All</button>
            {categoryChips.map((cat) => (
              <button key={cat} type="button" onClick={() => setActiveCategory(cat)} className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${activeCategory === cat ? "bg-red-600 text-white" : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"}`}>{CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}</button>
            ))}
          </div>
        </div>
      </header>

      {filtered.length > 0 ? (
        <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => <Card key={`${item.kind}-${item.id}`} item={item} onVisit={() => markVisited(item.id)} />)}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <p className="text-lg font-medium text-zinc-700 dark:text-zinc-200">Nothing here</p>
          <button type="button" onClick={() => { setQuery(""); setActiveCategory("all"); }} className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">Clear filters</button>
        </div>
      )}

    </main>
  );
}
