# PupTV — Session Handoff (July 31, 2026)

For the next session managing this project. Everything below is current as of this handoff.

## What PupTV is
Upload dog photos → AI cartoon episodes starring that dog → auto-published to the customer's own YouTube channel. $4.99 single / $9.99 three-pack / $19.99 season (6 episodes). $1/episode pledged to dog rescues. Target: dog owners 55+, plus adult kids as gift buyers. Dogs first, pet-agnostic under the hood.

## Live assets
- **App**: https://puptv.vercel.app — REAL generation works (env-gated on REPLICATE_API_TOKEN, which is set on Vercel). Demo mode fallback, rate caps (3 runs/IP/day, 20/day global), kill switch PUPTV_LIVE=off. Full feature set: create flow (photos → details → preview gate → checkout(demo) → confirmation), /gift /impact /favorites /pricing /memorial /pros /account-pending.
- **Repo**: github.com/shinerblue/puptv (public). Clone on Chad's Mac: /tmp/puptv-push. gh CLI authed. Docs: spec-v2.md, economics-and-structure.md (deep research w/ exec summary), youtube-verification.md, charity-structure.md, competitors.md, marketing-copy.md, auth pending. Pipeline reference: pipeline/puptv_pipeline_test.py (proven; has --details flag).
- **YouTube channel** (Chad's, via Zapier connection): park PIcIfIdC1kA, beach LjfZLmGnw6g, space 799im9gjl_I, birthday az4C8MWRqXc, mega-loops XO3ExfNCFaY (5min) / UK3_HqaVJlw (15min); playlist "Dutch's Favorites — PupTV" (PLLB2bcFM3JBo). All unlisted, made_for_kids=false.
- **Media files**: in this outputs folder (dutch_* loops, stills, poster, calm+music versions, music_*.wav).

## Key technical facts (hard-won — do not relearn)
- Models: google/nano-banana-pro (stills, identity via ref photos + chained cartoon still), kwaivgi/kling-v2.5-turbo-pro (5s clips), google/lyria-2 (music, ~$0.10). Replicate token in "/Users/chad/Documents/Claude/Projects/Dog Video App/.env.local"; account allows ~2 concurrent predictions (429 = wait 45–60s).
- Replicate delivery URLs expire ~1 hour.
- Mac quirks: shell exports NODE_ENV=production (always `npm install --include=dev`); use `caffeinate -i` for long processes (App Nap killed an early run); Tailwind utilities are HAND-ROLLED in globals.css (Turbopack skips PostCSS in prod — any new class must be added there).
- Zapier YouTube connector: upload_video REQUIRES category_id ("15"); resolver forces made_for_kids=true → always fix after via _zap_raw_request PUT videos?part=status; YouTube quota ~6 uploads/day was hit once (resets midnight Pacific).
- Supabase project ylqqvwcqylkuosamhaxs INACTIVE; free tier maxed (2 active projects) — app deliberately has ZERO database.

## In flight / parked
- **AUTH (task #17, INCOMPLETE)**: branch `auth-wip` has partial Auth.js work (next-auth in package.json, src/lib/auth.ts, src/app/api/auth/, AuthProvider, GoogleSignInButton, auth-actions) — agent was cut off by the weekly rate limit (resets 3pm CT 7/31). Finish per the original spec: JWT sessions no DB, Google provider env-gated (GOOGLE_CLIENT_ID/SECRET + AUTH_SECRET), Apple scaffolded behind env flag, graceful degradation when env vars absent (production has NONE yet — site must be unchanged), docs/auth-setup.md with Google Cloud console click-path (redirect URI https://puptv.vercel.app/api/auth/callback/google), then verify build in both modes and merge to main. Strategic note: this Google OAuth app is the same one that later gets the youtube.upload scope (see docs/youtube-verification.md).

## Chad's open decisions
1. Attorney review: LLC + $1/episode pledge structure (CCV compliance in 7 states) — see economics doc exec summary.
2. Preview-cost guard: watermarked cheap preview ($0.04) vs Stripe auth-then-capture.
3. Start Google's YouTube API verification (2–8 weeks — long pole).
4. Create the Google OAuth client (10 min of console clicks; steps will be in docs/auth-setup.md) so sign-in goes live.
5. Real Stripe; storage strategy (Supabase paid org or alternative); custom domain.

## Total spend so far
~$13–15 Replicate credits across all generation. Every generation path verified working.
