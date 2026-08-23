<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## YouTube Link Validation

Playlist data is stored in `src/data/library.json`. When repairing or adding links:

1. Inspect each playlist URL and compare it with the entry's title, channel, and `firstVideoId`.
2. Validate playlist URLs with `yt-dlp` rather than checking only whether the URL has the expected shape:

   ```bash
   yt-dlp --flat-playlist --playlist-items 1 --print '%(playlist_id)s | %(playlist_title)s | %(id)s | %(title)s' 'https://www.youtube.com/playlist?list=PLAYLIST_ID'
   ```

3. Use the channel's `/playlists` page with `yt-dlp` to find the canonical playlist ID when an ID is invalid or malformed.
4. Update `firstVideoId` to a video that exists in the repaired playlist so thumbnails remain accurate.
5. Do not put a standalone course video in `playlists`; move it to `videos` with a `videoId` and a `/watch?v=` URL instead of linking it to an unrelated playlist.
6. Validate all playlist URLs after editing, then run `npm run lint` and `npm run build`.
