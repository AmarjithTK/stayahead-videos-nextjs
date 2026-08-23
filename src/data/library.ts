import library from "./library.json";

export type PlaylistCategory =
  | "programming"
  | "web-development"
  | "data-science"
  | "mathematics"
  | "science"
  | "history"
  | "languages"
  | "design"
  | "career"
  | "other";

export interface PlaylistEntry {
  id: string;
  title: string;
  category: PlaylistCategory;
  url: string;
  /** First video of the playlist — used to derive a live thumbnail. */
  firstVideoId?: string;
  channel: string;
  featured?: boolean;
  tags?: string[];
}

export interface VideoEntry {
  id: string;
  title: string;
  category: PlaylistCategory;
  url: string;
  videoId: string;
  channel: string;
  tags?: string[];
}

export interface Library {
  playlists: PlaylistEntry[];
  videos: VideoEntry[];
}

export const CATEGORY_LABELS: Record<PlaylistCategory, string> = {
  programming: "Programming",
  "web-development": "Web Development",
  "data-science": "Data Science",
  mathematics: "Mathematics",
  science: "Science",
  history: "History",
  languages: "Languages",
  design: "Design",
  career: "Career",
  other: "Other",
};

const data = library as Library;

export const playlists = data.playlists;
export const videos = data.videos;

export function thumbnailFor(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
}
