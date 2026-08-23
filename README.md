# Stayahead

A landing page that curates YouTube educational video playlists so you can easily search, filter, and pick your next course. Built with [Next.js](https://nextjs.org) (App Router), TypeScript, and Tailwind CSS, and configured for static hosting on [Cloudflare Pages](https://pages.cloudflare.com).

## Features

- **Card grid** of playlists with gradient placeholder thumbnails (or real thumbnails via `thumbnailUrl`)
- **Live search** across title, description, channel, category, and tags
- **Category filter chips** (Programming, Web Development, Data Science, Math, Science, History, Languages, Design, Career, Other)
- **Featured playlists** pinned to the top with a badge
- **Video counts** shown on each card
- **Dark mode** support (follows system preference)
- **Static export** — no server required, deployable anywhere

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding Your Own Playlists

All playlist data lives in one file: [`src/data/playlists.ts`](src/data/playlists.ts).

Each playlist entry looks like this:

```ts
{
  id: "freecodecamp-python",
  title: "Learn Python - Full Course for Beginners",
  description: "A comprehensive beginner course covering Python fundamentals.",
  category: "programming",
  playlistId: "rfscVS0vtbw", // the value after ?list= in the YouTube URL
  channel: "freeCodeCamp.org",
  videoCount: 45,
  featured: true,
  tags: ["python", "beginner", "full course"],
}
```

To add a playlist:

1. Open [`src/data/playlists.ts`](src/data/playlists.ts).
2. Copy the playlist URL from YouTube (e.g. `https://www.youtube.com/playlist?list=PLWKjhJtqVAbnQkdIc9W3HfY4QpY1F3G4X`).
3. Add a new object to the `playlists` array with the `playlistId` set to the value after `?list=`.
4. Optionally set `thumbnailUrl` to a direct image URL; otherwise a gradient placeholder is generated automatically.
5. Save — the landing page updates instantly.

> **Note:** The sample playlist IDs in the file are placeholders. Replace them with your real playlist IDs.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout + metadata
│   ├── page.tsx          # Landing page (header + grid)
│   └── globals.css       # Tailwind v4 styles
├── components/
│   └── PlaylistGrid.tsx  # Search, filters, and card grid (client component)
└── data/
    └── playlists.ts      # Single source of truth for all playlists
```

## Deploying to Cloudflare Pages

This project is pre-configured for Cloudflare Pages:

- [`next.config.ts`](next.config.ts) sets `output: "export"` for a fully static build.
- [`wrangler.toml`](wrangler.toml) declares the Pages project name and build output directory (`out`).

### Option A — Git integration (recommended)

1. Push this repository to GitHub or GitLab.
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository and configure the build:
   - **Framework preset:** Next.js (static HTML export)
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
4. Click **Save and Deploy**. Cloudflare will rebuild on every push.

### Option B — Wrangler CLI

```bash
npm install -g wrangler
npx wrangler pages deploy out --project-name youtube-playlists
```

Or, if you prefer the full wrangler workflow:

```bash
npm run build
npx wrangler pages deploy out
```

### Local preview of the static build

```bash
npm run build
npx serve out   # or: npx wrangler pages dev out
```

## Learn More

- [Next.js static export docs](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/)
- [Wrangler configuration reference](https://developers.cloudflare.com/pages/functions/wrangler-configuration/)
