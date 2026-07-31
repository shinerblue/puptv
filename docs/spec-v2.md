# PupTV — Product & Technical Spec v2

*July 30, 2026 — rebuilt around the proven pipeline (Nano Banana Pro + Kling 2.5)*

> **Status: this is the target design, not the deployed system.**
> What is actually live at https://puptv.vercel.app as of this review:
>
> | Spec says | Actually deployed |
> |---|---|
> | Supabase for auth, `video_jobs` queue, storage | **Not used.** `src/lib/supabase.ts` is inert and nothing imports it. There is no database and no auth. |
> | Replicate webhooks → Supabase edge function state machine | **Client-side polling** of `/api/job-status` every 5s. No webhooks. |
> | Stripe payment | **Demo stub** (`/api/checkout`) — nothing is charged, ever. |
> | Google OAuth / YouTube Data API upload | **Demo stub** (`/api/connect-youtube`) — no Google account is contacted. |
> | ffmpeg stitching worker | **Not built.** The result screen loops three separate 5s clips client-side. |
> | Persistent render storage | **None.** Replicate output URLs expire in ~1 hour. |
>
> Live AI generation *is* real and env-gated on `REPLICATE_API_TOKEN`
> (kill switch `PUPTV_LIVE=off`). Everything downstream of "here are your
> clips" is still demo mode. See `README.md` for the as-built contract.

## One-liner

Upload photos of your dog, and a cartoon adventure series starring *your* dog appears on *your* YouTube — automatically. Proceeds fund dog charities instead of content farms.

## What we proved today

The full pipeline ran end-to-end on Dutch (fluffy French Bulldog) for ~$2 and ~10 minutes:

| Stage | Model | Result |
|---|---|---|
| Cartoonify | `google/nano-banana-pro` | Identity preserved — coat, ears, face, collar recognizable across all 3 scenes. Chaining the first cartoon output back in as a reference keeps the character consistent. |
| Details correction | prompt injection | "VERY SHORT stubby screw tail" fixed the breed-wrong tail in one shot. A user-facing details field works. |
| Animate | `kwaivgi/kling-v2.5-turbo-pro` | Real animation from each still, 5s/scene, ~3–5 min each |
| Assemble | ffmpeg concat | 30s looping MP4 |

The April 2026 build failed because the models weren't good enough (PhotoMaker/instruct-pix2pix/SDXL lost identity; SVD barely moved). That problem is solved. **The pipeline is no longer the product risk.**

## The actual product insight

Generation is not the moat — anyone can make an AI clip in a chat app, and it dies there. The target customer (older, non-technical dog owners) will never download an MP4 and upload it anywhere. The moat is the **last mile**: after a one-time "Sign in with Google" at checkout, every video publishes to the customer's own YouTube channel automatically. They open YouTube on their TV, and Dutch's channel is just *there*.

Competitive landscape confirms the gap: DOGTV ($6.99–9.99/mo) is generic non-personalized footage; DreamPets and Pawtograph make shareable pet clips for humans with no delivery story. Nobody does personalized Dog TV delivered to the customer's TV.

## User flow

1. **Upload** — 1–5 photos of the dog
2. **Describe** — name + breed + free-text details ("French Bulldog, very short screw tail"). This field is load-bearing: it corrects the model's breed assumptions.
3. **Pick theme** — park, beach, space, mountain, city (more later)
4. **Preview** — show the 3 cartoon stills *before* charging. Cheap ($0.40) and kills refund risk. Offer one free "fix my dog" details retry.
5. **Pay** — Stripe, $4.99 intro SKU
6. **Connect YouTube** — one-time Google OAuth (youtube.upload scope)
7. **Deliver** — video renders async (~10 min), auto-publishes to their channel (unlisted or public, their choice), email/text with a "Watch on your TV" link and dead-simple TV instructions

## Architecture

Keep the existing rails, replace the engine:

- **Next.js on Vercel** (existing `puptv` project) — UI only, no long-running AI calls in routes (April's 413/timeout mistakes)
- **Supabase** (existing project `ylqqvwcqylkuosamhaxs`) — auth, `video_jobs` queue, storage for photos/renders
- **Replicate webhooks** — every prediction fires a webhook to a Supabase edge function that advances the job state machine (upload → stills → preview-approved → clips → stitched → uploaded). No polling, no serverless timeouts.
- **Stitching** — small worker (Fly.io/Railway container with ffmpeg) or Replicate ffmpeg model
- **YouTube Data API** — direct integration with per-user OAuth tokens stored in Supabase (Zapier was the PoC; production uses the API directly)
- **Stripe** — payment; webhook marks job paid and starts full render

## Unit economics (verified costs)

| Item | Cost |
|---|---|
| 3 stills (Nano Banana Pro 2K) | ~$0.40 |
| 3 × 5s clips (Kling 2.5 Turbo Pro) | ~$1.05 |
| Stitch/infra | ~$0.10 |
| **COGS per 30s video** | **~$1.55** |
| Retail | $4.99 |
| Stripe fee | ~$0.45 |
| **Margin per video** | **~$3.00** → charity pool + overhead |

Upsell SKUs: $9.99 three-theme pack (~90s), $19.99 "season" (10 videos over time). Longer videos scale linearly in cost, so tiers matter.

## Nonprofit angle

100% of net proceeds to dog rescues after disclosed overhead. Structure question (own 501(c)(3) vs. fiscal sponsorship vs. for-profit with binding donation pledge) needs a lawyer — fiscal sponsorship is the fast path to legitimacy while volume is low. Publish a public running ledger: videos sold → dollars donated → shelters funded. The ledger *is* the marketing.

## Risks / open items

- **YouTube API verification** — the `youtube.upload` scope requires Google app verification before uploads can be public for arbitrary users; unverified apps get locked-private uploads. Start the review early; it takes weeks. Interim: PoC via Zapier connection (works today for our own channel).
- **Replicate concurrency** — account currently caps ~2 concurrent predictions (hit 429s today). Request a limit increase or add fal.ai as second provider before real traffic.
- **Made-for-kids flag** — dog cartoon content looks kid-adjacent to YouTube's classifier; set `made_for_kids` deliberately and document the policy position.
- **Quality variance** — Kling occasionally morphs anatomy; auto-QC pass (or human review at low volume) before publishing to a customer's channel.
- **Charity administration** — vetting recipients, disbursement cadence, receipts.

## MVP cut (2–3 sessions of work)

1. Rip out old Replicate code; new job state machine + webhooks (Supabase)
2. Create flow v2: photos + name + **details** + theme, stills preview gate
3. Stripe checkout
4. YouTube OAuth + upload on render completion
5. Email notification with TV instructions
6. Ledger page (manual data at first)

## Privacy, sharing, and playback (v2.1)

- **Per-video privacy** — user picks private / unlisted / public at creation (YouTube API `privacyStatus`). Private still works as Dog TV on any TV signed into their account.
- **App-layer sharing** — we keep the master MP4; YouTube's private-share is too clunky. Share = in-app link, or "**send to Grandma's TV**": upload the episode directly to another connected user's channel.
- **Favorites playlist** — app-managed YouTube playlist of favorite episodes (autoplay; ads possible between videos).
- **Mega-loop render (premium)** — stitch favorites server-side into one continuous 1–4 hr video, uploaded as a single file. No between-video breaks; the real "uninterrupted Dog TV" answer. Truly ad-free guarantee requires our own TV app or download — later phase.

## Feature backlog (v2.1 ideas)

Multi-dog episodes (Nano Banana Pro handles multiple subjects) · Season-pass subscription (new episode monthly, auto-published) · Gift flow (adult kids buy for parents — likely top acquisition channel) · Holiday + dog-birthday episodes · Pack crossovers (your dog + friend's dog; viral loop) · Calming mode (dog-vision palette, low-stress audio, slower motion — DOGTV's science, our personalization) · Owner's-voice audio layer · Charity picker with impact receipt · Print-on-demand poster of the character · B2B calm loops for kennels/vets/daycares · Memorial episodes (gentle handling).

## Today's artifacts

- `puptv_pipeline_test.py` — working pipeline script (now with `--details`)
- `pup_park_loop.mp4` — first proof video (pre-correction)
- `dutch_park_loop.mp4` — corrected video (rendering now)
- Zapier YouTube connection — last-mile PoC
- Old assets still live: `puptv.vercel.app`, GitHub `shinerblue/puptv`, Supabase `ylqqvwcqylkuosamhaxs`
