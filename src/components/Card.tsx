"use client";

import type { PlaylistCategory } from "@/data/library";

interface CardItem {
  kind: "playlists" | "videos";
  id: string;
  title: string;
  url: string;
  channel: string;
  category: PlaylistCategory;
  tags: string[];
  thumbnail?: string;
}

export type { CardItem };

export default function Card({ item, onVisit }: { item: CardItem; onVisit?: () => void }) {
  return (
    <a
      href={item.url}
      onClick={onVisit}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-w-0 flex-col"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-200 shadow-sm transition group-hover:rounded-xl dark:bg-zinc-800">
        {item.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-200 group-hover:brightness-75"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
               className="h-12 w-12 text-zinc-400 dark:text-zinc-600"
              aria-hidden="true"
            >
              <path d="M8 5.14v13.72c0 .8.87 1.3 1.56.9l11.02-6.86a1.05 1.05 0 0 0 0-1.8L9.56 4.24A1.05 1.05 0 0 0 8 5.14Z" />
            </svg>
          </div>
        )}
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
          {item.kind === "playlists" ? "Playlist" : "Video"}
        </span>
      </div>
      <div className="flex gap-3 pt-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold uppercase text-white dark:bg-zinc-700">{item.channel.slice(0, 1)}</span>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-zinc-900 dark:text-zinc-50">{item.title}</h3>
          <span className="mt-1 block truncate text-[13px] text-zinc-500 dark:text-zinc-400">{item.channel}</span>
          <span className="mt-0.5 block text-xs capitalize text-zinc-500 dark:text-zinc-500">{item.category.replace("-", " ")}</span>
        </div>
        <span className="pt-0.5 text-lg leading-none text-zinc-500 opacity-0 transition group-hover:opacity-100" aria-hidden="true">⋮</span>
      </div>
    </a>
  );
}
