"use client";

import { type PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { CATEGORY_LABELS, playlists, resources, thumbnailFor, videos } from "@/data/library";
import Card, { type CardItem } from "./Card";
import ResourceCard, { type ResourceItem } from "./ResourceCard";

type Tab = "playlists" | "videos" | "visited" | "resources";
type Theme = "light" | "dark";

const navItems: Array<[Tab, string, string]> = [
  ["playlists", "Home", "M3 10.5 10 4l7 6.5v6a1 1 0 0 1-1 1h-3v-5H9v5H6a1 1 0 0 1-1-1v-6Z"],
  ["videos", "Videos", "M5 4.5h10a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Zm4 3v5l4-2.5-4-2.5Z"],
  ["visited", "History", "M4 10a6 6 0 1 0 2-4.47M4 4v4h4"],
  ["resources", "Resources", "M5 4.5h10a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1ZM7 8h6M7 11h4"],
];

const awarenessQuotes = [
  ["Nothing in life is to be feared, it is only to be understood.", "Marie Curie"],
  ["The important thing is not to stop questioning.", "Albert Einstein"],
  ["What we know is a drop, what we don't know is an ocean.", "Isaac Newton"],
  ["The first principle is that you must not fool yourself, and you are the easiest person to fool.", "Richard Feynman"],
  ["Somewhere, something incredible is waiting to be known.", "Carl Sagan"],
  ["The good thing about science is that it's true whether or not you believe in it.", "Neil deGrasse Tyson"],
  ["The man of science has learned to believe in justification, not by faith, but by verification.", "Thomas Huxley"],
  ["The scientist is not a person who gives the right answers, he is one who asks the right questions.", "Claude Levi-Strauss"],
  ["We can only see a short distance ahead, but we can see plenty there that needs to be done.", "Alan Turing"],
  ["The most dangerous phrase in the language is, 'We've always done it this way.'", "Grace Hopper"],
  ["The only way to learn a new programming language is by writing programs in it.", "Brian Kernighan"],
  ["Computer science is no more about computers than astronomy is about telescopes.", "Edsger Dijkstra"],
  ["An essential aspect of creativity is not being afraid to fail.", "Edwin Land"],
  ["The best way to predict the future is to invent it.", "Alan Kay"],
  ["The future is already here. It is just not evenly distributed.", "William Gibson"],
  ["The people who are crazy enough to think they can change the world are the ones who do.", "Steve Jobs"],
  ["Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do great work.", "Steve Jobs"],
  ["If you do what you've always done, you'll get what you've always gotten.", "Tony Robbins"],
  ["Ideas are easy. Implementation is hard.", "Guy Kawasaki"],
  ["The way to get started is to quit talking and begin doing.", "Walt Disney"],
  ["The best vision is insight.", "Malcolm Forbes"],
  ["The value of an idea lies in the using of it.", "Thomas Edison"],
  ["The present is theirs; the future, for which I really worked, is mine.", "Nikola Tesla"],
  ["The future belongs to those who prepare for it today.", "Malcolm X"],
  ["The mind is not a vessel to be filled, but a fire to be kindled.", "Plutarch"],
  ["We are what we repeatedly do. Excellence, then, is not an act, but a habit.", "Aristotle"],
  ["The impediment to action advances action. What stands in the way becomes the way.", "Marcus Aurelius"],
  ["Luck is what happens when preparation meets opportunity.", "Seneca"],
  ["It is not that we have a short time to live, but that we waste a lot of it.", "Seneca"],
  ["The journey of a thousand miles begins with one step.", "Lao Tzu"],
  ["The man who moves a mountain begins by carrying away small stones.", "Confucius"],
  ["He who learns but does not think, is lost. He who thinks but does not learn is in great danger.", "Confucius"],
  ["The future depends on what you do today.", "Simone Weil"],
  ["The secret of getting ahead is getting started.", "Mark Twain"],
  ["A person who never made a mistake never tried anything new.", "Albert Einstein"],
  ["Great things are done by a series of small things brought together.", "Vincent van Gogh"],
  ["It is never too late to be what you might have been.", "George Eliot"],
  ["Nothing will work unless you do.", "Maya Angelou"],
];

function ageOnDate(date: Date): number {
  const birthday = new Date(2002, 9, 13);
  let age = date.getFullYear() - birthday.getFullYear();
  const hasHadBirthday = date.getMonth() > birthday.getMonth() ||
    (date.getMonth() === birthday.getMonth() && date.getDate() >= birthday.getDate());
  if (!hasHadBirthday) age -= 1;
  return age;
}

function nextBirthdayFrom(date: Date): Date {
  const birthday = new Date(date.getFullYear(), 9, 13);
  if (birthday <= date) birthday.setFullYear(birthday.getFullYear() + 1);
  return birthday;
}

function formatCountdown(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days ? `${days}d ` : ""}${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

function nextDailyTime(date: Date, hour: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour % 24);
  if (hour === 24) target.setDate(target.getDate() + 1);
  if (target <= date) target.setDate(target.getDate() + 1);
  return target;
}

function nextMonths(date: Date, months: number): Date {
  const target = new Date(date);
  target.setMonth(target.getMonth() + months);
  return target;
}

function nextYearMarker(date: Date): [string, Date] {
  const midYear = new Date(date.getFullYear(), 6, 1);
  return date < midYear
    ? ["Mid-year in", midYear]
    : ["Next year in", new Date(date.getFullYear() + 1, 0, 1)];
}

function awarenessCountdowns(date: Date): Array<[string, Date]> {
  const hour = date.getHours();
  if (hour < 12) {
    return [["Lunch in", nextDailyTime(date, 12)], ["Evening in", nextDailyTime(date, 18)]];
  }
  if (hour < 18) {
    return [["Evening in", nextDailyTime(date, 18)], ["Midnight in", nextDailyTime(date, 24)]];
  }
  return [["Midnight in", nextDailyTime(date, 24)], ["Morning in", nextDailyTime(date, 8)]];
}

export default function Library() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [tab, setTab] = useState<Tab>("playlists");
  const [visitedIds, setVisitedIds] = useState<string[]>([]);
  const [progressById, setProgressById] = useState<Record<string, number>>({});
  const [theme, setTheme] = useState<Theme>("light");
  const [now, setNow] = useState<Date | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [animationVariant, setAnimationVariant] = useState(0);
  const [colorVariant, setColorVariant] = useState(0);
  const awarenessSceneRef = useRef<HTMLDivElement>(null);
  const [showAwareness, setShowAwareness] = useState(true);
  const [isDismissingAwareness, setIsDismissingAwareness] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("learntube-theme");
    const nextTheme: Theme = savedTheme === "dark" ? "dark" : "light";
    // Apply the user's persisted preference after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }, []);

  useEffect(() => {
    // Keep the clock client-only so its server-rendered markup stays stable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const savedQuoteHistory = window.localStorage.getItem("learntube-quote-history");
    let seenQuotes: number[] = [];
    try {
      const parsed = savedQuoteHistory ? JSON.parse(savedQuoteHistory) : [];
      if (Array.isArray(parsed)) seenQuotes = parsed.filter((index): index is number => Number.isInteger(index));
    } catch {
      window.localStorage.removeItem("learntube-quote-history");
    }
    const availableQuotes = awarenessQuotes
      .map((_, index) => index)
      .filter((index) => !seenQuotes.includes(index));
    const pool = availableQuotes.length > 0 ? availableQuotes : awarenessQuotes.map((_, index) => index);
    const selectedQuote = pool[Math.floor(Math.random() * pool.length)];
    const nextHistory = availableQuotes.length > 0 ? [...seenQuotes, selectedQuote] : [selectedQuote];
    window.localStorage.setItem("learntube-quote-history", JSON.stringify(nextHistory));
    setAnimationVariant(Math.floor(Math.random() * 8));
    setColorVariant(Math.floor(Math.random() * 10));
    // Select one quote for this visit; it must not rotate while the overlay is open.
    setQuoteIndex(selectedQuote);
    const clock = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.clearInterval(clock);
    };
  }, []);

  useEffect(() => {
    const savedProgress = window.localStorage.getItem("learntube-progress");
    if (!savedProgress) return;
    try {
      const progress = JSON.parse(savedProgress);
      if (progress && typeof progress === "object" && !Array.isArray(progress)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProgressById(progress);
      }
    } catch {
      window.localStorage.removeItem("learntube-progress");
    }
  }, []);

  useEffect(() => {
    const savedVisits = window.localStorage.getItem("learntube-visited");
    if (!savedVisits) return;
    try {
      const ids = JSON.parse(savedVisits);
      if (Array.isArray(ids)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisitedIds(ids.filter((id): id is string => typeof id === "string"));
      }
    } catch {
      window.localStorage.removeItem("learntube-visited");
    }
  }, []);

  const allItems = useMemo<CardItem[]>(() => [
    ...playlists.map((item) => ({ kind: "playlists" as const, id: item.id, title: item.title, url: item.url, channel: item.channel, category: item.category, tags: item.tags ?? [], thumbnail: item.firstVideoId ? thumbnailFor(item.firstVideoId) : undefined })),
    ...videos.map((item) => ({ kind: "videos" as const, id: item.id, title: item.title, url: item.url, channel: item.channel, category: item.category, tags: item.tags ?? [], thumbnail: thumbnailFor(item.videoId) })),
  ], []);

  const resourceItems = useMemo<ResourceItem[]>(() => resources.map((item) => ({
    kind: "resources" as const,
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    url: item.url,
    source: item.source,
    tags: item.tags ?? [],
  })), []);

  const continueItem = useMemo(() => {
    const id = visitedIds[0];
    return allItems.find((item) => item.id === id) ?? resourceItems.find((item) => item.id === id);
  }, [allItems, resourceItems, visitedIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const source = tab === "resources" ? resourceItems : allItems;
    return source.filter((item) => {
      const inTab = tab === "visited" ? visitedIds.includes(item.id) : tab === "resources" || item.kind === tab;
      if (!inTab || (activeCategory !== "all" && item.category !== activeCategory)) return false;
      const owner = item.kind === "resources" ? item.source : item.channel;
      return !q || [item.title, owner, ...item.tags].join(" ").toLowerCase().includes(q);
    });
  }, [activeCategory, allItems, query, resourceItems, tab, visitedIds]);

  const categoryChips = useMemo(() => {
    const categories = new Set<string>();
    const source = tab === "resources" ? resourceItems : allItems;
    source.forEach((item) => {
      if (tab === "visited" ? visitedIds.includes(item.id) : tab === "resources" || item.kind === tab) categories.add(item.category);
    });
    return Array.from(categories);
  }, [allItems, resourceItems, tab, visitedIds]);

  function switchTab(nextTab: Tab) {
    setTab(nextTab);
    setActiveCategory("all");
    setQuery("");
  }

  function markVisited(id: string) {
    setVisitedIds((current) => {
      const next = [id, ...current.filter((visitedId) => visitedId !== id)];
      window.localStorage.setItem("learntube-visited", JSON.stringify(next));
      return next;
    });
    setProgressById((current) => {
      if (current[id] !== undefined) return current;
      const next = { ...current, [id]: 10 };
      window.localStorage.setItem("learntube-progress", JSON.stringify(next));
      return next;
    });
  }

  function updateProgress(id: string, value: number) {
    setProgressById((current) => {
      const next = { ...current, [id]: value };
      window.localStorage.setItem("learntube-progress", JSON.stringify(next));
      return next;
    });
  }

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    window.localStorage.setItem("learntube-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }

  const [yearMarkerLabel, yearMarker] = now ? nextYearMarker(now) : ["", new Date()];

  function dismissAwareness() {
    if (isDismissingAwareness) return;
    setIsDismissingAwareness(true);
    window.setTimeout(() => setShowAwareness(false), 350);
  }

  function followAwarenessPointer(event: PointerEvent<HTMLDivElement>) {
    const scene = awarenessSceneRef.current;
    if (!scene) return;
    scene.style.setProperty("--pointer-x", `${event.clientX}px`);
    scene.style.setProperty("--pointer-y", `${event.clientY}px`);
  }

  return (
    <main className="min-h-screen w-full bg-white text-zinc-900 dark:bg-[#0f0f0f] dark:text-zinc-100">
      <header className="sticky top-0 z-30 h-14 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-[#0f0f0f]/95">
        <div className="flex h-full items-center gap-4 px-4">
          <div className="flex w-auto shrink-0 items-center gap-2 sm:w-52 sm:gap-4">
            <span className="text-2xl text-zinc-800 dark:text-zinc-100" aria-hidden="true">&#9776;</span>
            <div className="flex items-center gap-1.5">
              <span className="flex h-6 w-9 items-center justify-center rounded-md bg-red-600 text-[10px] font-black text-white">&#9654;</span>
              <span className="hidden text-xl font-bold tracking-[-0.08em] sm:inline">YouTube</span>
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-[680px]">
            <div className="relative flex-1">
              <svg viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden="true"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" /></svg>
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" className="h-10 w-full rounded-l-full border border-zinc-300 bg-white py-2 pl-11 pr-4 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-[#121212]" />
            </div>
            <button type="button" aria-label="Search" className="flex h-10 w-16 items-center justify-center rounded-r-full border border-l-0 border-zinc-300 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"><svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" /></svg></button>
          </div>
          <div className="ml-auto flex w-auto shrink-0 items-center justify-end gap-2 sm:w-52 sm:gap-3">
            <button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} className="rounded-full p-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">{theme === "light" ? "☾" : "☀"}</button>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">LT</span>
          </div>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-14 z-20 hidden w-60 border-r border-zinc-200 bg-white px-3 py-3 dark:border-zinc-800 dark:bg-[#0f0f0f] lg:block">
        <nav className="space-y-1 text-sm">
          {navItems.map(([key, label, path]) => <button key={key} type="button" onClick={() => switchTab(key)} className={`flex w-full items-center gap-5 rounded-lg px-3 py-2.5 text-left ${tab === key ? "bg-zinc-100 font-medium dark:bg-zinc-800" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true"><path d={path} /></svg>{label}</button>)}
        </nav>
        <div className="my-4 border-t border-zinc-200 dark:border-zinc-800" />
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Explore</p>
        <nav className="space-y-1 text-sm">
          {categoryChips.map((category) => <button key={category} type="button" onClick={() => { setTab("resources"); setActiveCategory(category); }} className="flex w-full items-center gap-5 rounded-lg px-3 py-2.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800"><span className="w-5 text-center text-zinc-500">&#8226;</span>{CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}</button>)}
        </nav>
      </aside>

      <div className="border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-[#0f0f0f] lg:ml-60">
        <div className="flex gap-3 overflow-x-auto [scrollbar-width:none]">
          {([ ["playlists", "Playlists"], ["videos", "Videos"], ["visited", "History"], ["resources", "Resources"] ] as const).map(([key, label]) => <button key={key} type="button" onClick={() => switchTab(key)} className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"}`}>{label}</button>)}
          {categoryChips.map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${activeCategory === category ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"}`}>{CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}</button>)}
        </div>
      </div>

      {continueItem && (
        <div className="mx-auto mb-1 mt-5 w-full max-w-[1640px] px-4 sm:px-6 lg:ml-60 lg:w-[calc(100%-15rem)] lg:px-6 xl:px-8">
          <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-[#181818]">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-600">Continue learning</p>
              <p className="mt-1 truncate text-sm font-semibold">{continueItem.title}</p>
              <div className="mt-3 h-1.5 max-w-md overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700"><div className="h-full rounded-full bg-red-600" style={{ width: `${progressById[continueItem.id] ?? 0}%` }} /></div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {[25, 50, 75, 100].map((value) => <button key={value} type="button" onClick={() => updateProgress(continueItem.id, value)} className={`rounded-md px-2 py-1 text-[11px] font-medium ${progressById[continueItem.id] === value ? "bg-red-600 text-white" : "bg-white text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700"}`}>{value}%</button>)}
              <a href={continueItem.url} target="_blank" rel="noopener noreferrer" onClick={() => markVisited(continueItem.id)} className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white">Continue</a>
            </div>
          </div>
        </div>
      )}

      {filtered.length > 0 ? <div className="mx-auto w-full max-w-[1640px] px-4 pt-6 sm:px-6 lg:ml-60 lg:w-[calc(100%-15rem)] lg:px-6 xl:px-8"><div className={tab === "resources" ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6" : "grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}>{filtered.map((item) => item.kind === "resources" ? <ResourceCard key={`resource-${item.id}`} item={item} onVisit={() => markVisited(item.id)} /> : <Card key={`${item.kind}-${item.id}`} item={item} onVisit={() => markVisited(item.id)} />)}</div></div> : <div className="flex flex-col items-center gap-3 py-24 text-center"><p className="text-lg font-medium">Nothing here</p><button type="button" onClick={() => { setQuery(""); setActiveCategory("all"); }} className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">Clear filters</button></div>}

      {showAwareness && now && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 p-6 backdrop-blur-sm transition-opacity duration-300 ${isDismissingAwareness ? "opacity-0" : "animate-[awareness-in_500ms_ease-out] opacity-100"}`}
          onClick={dismissAwareness}
          onPointerMove={followAwarenessPointer}
          role="presentation"
        >
          <div ref={awarenessSceneRef} className={`awareness-scene awareness-scene-${animationVariant} awareness-color-${colorVariant} absolute inset-0 overflow-hidden`} aria-hidden="true">
            <div className="awareness-orb awareness-orb-one" />
            <div className="awareness-orb awareness-orb-two" />
            <div className="awareness-grid" />
          </div>
          <div className="pointer-events-none relative w-full max-w-2xl text-center text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-400">Pause. Notice. Begin.</p>
            <p className="mt-8 text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">&ldquo;{awarenessQuotes[quoteIndex][0]}&rdquo;</p>
            <p className="mt-5 text-base text-zinc-300">{awarenessQuotes[quoteIndex][1]}</p>
            <div className="mt-12 text-zinc-200">
              <p className="text-5xl font-semibold tracking-tight sm:text-7xl">{now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })}</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-base sm:text-lg">
                <span>{now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
                <span className="h-1 w-1 rounded-full bg-red-500" />
                <span>Age {ageOnDate(now)}</span>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-zinc-300 sm:text-base">
              {awarenessCountdowns(now).map(([label, target]) => <span key={label}>{label} {formatCountdown(target.getTime() - now.getTime())}</span>)}
            </div>
            <p className="mt-10 text-sm font-medium text-zinc-400 sm:text-base">Click to continue</p>
          </div>
          <div className="absolute bottom-6 left-6 flex gap-5 text-left text-xs text-zinc-400 sm:bottom-10 sm:left-10 sm:gap-8 sm:text-sm">
            <span><strong className="block text-zinc-200">3 months</strong>{formatCountdown(nextMonths(now, 3).getTime() - now.getTime())}</span>
            <span><strong className="block text-zinc-200">6 months</strong>{formatCountdown(nextMonths(now, 6).getTime() - now.getTime())}</span>
          </div>
          <div className="absolute bottom-6 right-6 text-right text-xs text-zinc-400 sm:bottom-10 sm:right-10 sm:text-sm">
            <strong className="block text-zinc-200">{yearMarkerLabel}</strong>
            <span>{formatCountdown(yearMarker.getTime() - (now?.getTime() ?? yearMarker.getTime()))}</span>
            <strong className="mt-2 block text-zinc-200">Age {ageOnDate(now) + 1}</strong>
            <span>{formatCountdown(nextBirthdayFrom(now).getTime() - now.getTime())}</span>
          </div>
        </div>
      )}
    </main>
  );
}
