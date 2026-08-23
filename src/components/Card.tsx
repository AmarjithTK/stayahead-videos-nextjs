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
      className="group flex flex-col overflow-hidden rounded-xl transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-200 dark:bg-zinc-800">
        {item.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
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
        <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
          {item.kind === "playlists" ? "Playlist" : "Video"}
        </span>
      </div>
      <div className="flex flex-col gap-0.5 px-1 pt-2">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-zinc-900 dark:text-zinc-50">
          {item.title}
        </h3>
        <span className="truncate text-xs text-zinc-400 dark:text-zinc-500">
          {item.channel}
        </span>
      </div>
    </a>
  );
}
