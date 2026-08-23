import type { PlaylistCategory } from "@/data/library";

export interface ResourceItem {
  kind: "resources";
  id: string;
  title: string;
  description: string;
  category: PlaylistCategory;
  url: string;
  source: string;
  tags: string[];
}

export default function ResourceCard({ item, onVisit }: { item: ResourceItem; onVisit?: () => void }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onVisit}
      className="group flex min-h-44 flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-[#181818] dark:hover:border-zinc-700"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold uppercase text-white dark:bg-zinc-100 dark:text-zinc-900">
          {item.source.slice(0, 2)}
        </span>
        <span className="text-lg leading-none text-zinc-400 transition group-hover:text-red-600" aria-hidden="true">↗</span>
      </div>
      <h3 className="mt-4 line-clamp-2 text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-50">{item.title}</h3>
      <p className="mt-2 line-clamp-3 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{item.description}</p>
      <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-[11px] text-zinc-400 dark:text-zinc-500">
        <span className="truncate">{item.source}</span>
        <span className="shrink-0 capitalize">{item.category.replace("-", " ")}</span>
      </div>
    </a>
  );
}
