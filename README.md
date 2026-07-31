# PupTV

Upload dog photos → Pixar-style cartoon episodes starring that dog.
Live at https://puptv.vercel.app (Vercel auto-deploys `main`).

## Modes

The app runs in one of two modes, decided **server-side per request**:

| Mode | When | What happens |
|------|------|--------------|
| **Demo** | No `REPLICATE_API_TOKEN`, or `PUPTV_LIVE=off`, or over the daily caps | Sample stills / sample YouTube confirmation. Zero runtime deps, zero env vars — this is what a plain `next build` exercises. |
| **Live** | `REPLICATE_API_TOKEN` set (and `PUPTV_LIVE` not `off`) | Real generation: `google/nano-banana-pro` stills + `kwaivgi/kling-v2.5-turbo-pro` clips via Replicate. |

`GET /api/health` → `{ "live": true|false }` tells you which mode a deployment is in.

## Live generation pipeline

Reference implementation (proven offline, source of truth for prompts):
`pipeline/puptv_pipeline_test.py`. The web app mirrors it exactly:

1. **Preview stills** — client compresses photos to ≤1024px JPEG data URIs,
   `POST /api/cartoonify` per scene (0→1→2). Scene 0 establishes the cartoon
   character from the owner's photos; scenes 1–2 pass the scene-0 output back
   as `cartoonRefUrl` with the "render the IDENTICAL cartoon character"
   phrasing. Server returns `{ predictionId }` immediately; client polls
   `GET /api/job-status?id=` every 5s (~30–60s per still).
2. **Preview gate** — user approves the 3 stills; one free "fix my dog"
   retry re-runs with amended details.
3. **Checkout** — demo only. No payment provider is wired up.
4. **Clips** — `POST /api/generate-video` per approved still (Kling, 5s,
   ~3–6 min each, sequential). Prediction ids + finished URLs persist in
   `sessionStorage`, so the run survives reloads/tab exits.
5. **Result** — seamless looping player (3 stacked preloaded `<video>`
   elements, advance on `ended`) + per-clip downloads. No server-side
   stitching (no ffmpeg on Vercel); the channel version will be one
   continuous video later.

**Caveat:** Replicate output URLs (`replicate.delivery`) expire after ~1 hour.
Fine for the in-session flow; persistent storage is future work.

## API contract

- `POST /api/cartoonify` `{ photos: dataUri[], petName, details, theme, sceneIndex: 0-2, cartoonRefUrl? }`
  → live `{ predictionId }` | demo `{ demo: true, stills, notice? }`
- `POST /api/generate-video` `{ stillUrl, petName, theme, sceneIndex }`
  → live `{ predictionId }` | demo `{ demo: true, etaMinutes, sampleYoutubeVideoId, notice? }`
- `GET /api/job-status?id=` → `{ status, output, error }` (server-side proxy;
  the Replicate token never reaches the browser)
- HTTP 429 (Replicate allows ~2 concurrent predictions) → client waits 45s
  and retries automatically, max 5 times.

## Abuse guard

Best-effort in-memory caps (`src/lib/rateLimit.ts`): 3 preview runs/IP/day,
9 clips/IP/day, global soft cap 20 runs/day. Over cap → graceful demo
fallback with a gentle notice, never an error page.

## Development

```bash
npm install --include=dev
npm run build        # demo mode, no env needed
```

Env vars: see `.env.local.example`. Kill switch: set `PUPTV_LIVE=off` on
Vercel to force demo mode without removing the token.

**Styling note:** Turbopack skips the Tailwind PostCSS plugin in production
for this project — every utility class used anywhere must exist as
hand-rolled CSS in `src/app/globals.css`. Check before using a new class.
