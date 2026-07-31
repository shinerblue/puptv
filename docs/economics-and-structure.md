# PupTV — Economics, Charity Structure, Marketing, and Guardrails

**Deep research, July 31, 2026.** Prices verified against provider pages and current industry sources as of this date; anything labeled *estimate* is our modeling, not a verified fact. Legal sections are **research for discussion with a lawyer/CPA, not legal advice**. This goes substantially deeper than `charity-structure.md`, `competitors.md`, and `marketing-copy.md` and supersedes them where they conflict.

---

## Executive Summary

**1. The single episode is a good business. The current multi-episode SKUs are not.**
Verified COGS for a standard 30-second episode is ~$1.90 (2 Nano Banana Pro stills @ $0.15, 5 Kling 2.5 clips @ $0.35, 1 Lyria track @ $0.06–0.10). At $4.99 that's a **53% gross margin** after Stripe, **33% after the pledged $1 rescue donation**. But the marketing copy defines $9.99 = 3 episodes and $19.99 = 10 episodes: the 3-pack nets only $1.20 (12%) after its $2.50 pledge, and the **10-episode season loses $4.89 per sale** ($19 COGS + $0.88 Stripe + $5 pledge against $19.99). Fix the ladder before launch: season = 6 episodes (1 Standard premiere + 5 Budget-tier weeklies) → +$6.71 per sale, or reprice to $29.99. Separately, the marketing copy promises **"about 10 minutes" per episode — that is a ~$43 COGS promise at Kling pricing** ($0.07/sec × 600s). Align copy to the real 30–90s format before anyone buys.

**2. Offer three quality tiers.** Budget (Nano Banana + Hailuo 2.3 Fast): **~$1.05–1.40/episode**. Standard (current stack): **~$1.90**. Premium (Kling 3.0 at $0.075–0.112/s, or Veo 3.1 Fast with native audio at $0.15/s): **~$2.70–5.15** — Premium only works as a $14.99+ "Deluxe" SKU (~54% margin), never inside $4.99.

**3. Costs are falling ~50%/year at constant quality; plan for episode COGS near $1 by mid-2027 — but hedge.** Google cut Veo 3 prices 47–62% four months after launch; Kling 3.0 ships 4K/multi-shot at essentially the same $/sec as 2.5. Bear case is real: OpenAI **shut down Sora entirely in March 2026** after losing money on it, and quality expectations (native audio, 1080p) may force us onto pricier models. Mitigation: the pipeline already treats models as swappable — keep it that way, and recheck fal.ai/direct-API pricing quarterly (Google direct is ~11% cheaper than Replicate for Nano Banana Pro today).

**4. Do NOT make PupTV itself a 501(c)(3).** Selling cartoon videos is a commercial activity; courts deny/revoke exemption for charities whose main activity competes with for-profits (commerciality doctrine — *Better Business Bureau v. U.S.*, *Living Faith*, *Airlie Foundation*), and "the profits go to rescues" does not cure it (the destination-of-income argument was rejected decades ago). **Phase 1 (now):** for-profit LLC (new PupTV LLC ~$300, or a $25 "PupTV" assumed name under Dominium Group) with a **flat per-unit pledge ("$1 of every episode")**, written contracts with each recipient rescue, BBB-standard disclosures, and a donations API (e.g., Change or CharityAPI + IRS Pub 78 checks) powering the charity picker. Register as a commercial co-venturer only where required if we advertise there (7 states regulate; MA needs a $25k bond, AL $10k). **Phase 2 (~$50k+/yr in donations):** stand up a sibling PupTV Foundation 501(c)(3) — Texas formation $25, IRS Form 1023 $600 (or 1023-EZ $275 if under $50k/yr projected), attorney $1.5–5k.

**5. Getting paid is clean in the LLC and constrained in a nonprofit.** In the LLC, salary/distributions are unrestricted — the only legal duty is that the charitable claims are literally true and the pledged dollars actually move. In a 501(c)(3), founders may take *reasonable compensation* only, documented via the IRC 4958 "rebuttable presumption" process; excess pay triggers 25%/200% excise taxes and public Form 990 disclosure.

**6. Marketing: paid ads can't carry a $4.99 product — the rescues and the videos themselves are the channel.** Realistic paid CAC is $6–30 (pet-niche Meta CPM $9.56, median ecommerce CPA ~$30) vs $1.65 contribution on a single. So: rescue partnerships where the donation *is* the acquisition cost (iHeartDogs × Greater Good Charities proves the model), nano pet-influencer gifting (a digital product seeds influencers at ~$2 COGS each), the built-in viral loop (every shared episode is a demo), and PR ("grandma's dog has its own cartoon show"). 57% of 65+ Americans are on Facebook and 64% on YouTube — the delivery channel is the discovery channel. Reserve paid spend for the gift SKU in Q4 and retargeting. Full 30/60/90 plan below runs on <$900.

**7. Plug the leaks before launch.** Free pre-payment previews cost $0.45/abandoner — at a 10% preview→purchase rate that's **$4.05 of preview spend per sale**, wiping out margin. Switch to one watermarked low-res still from non-Pro Nano Banana ($0.039, −91%), or Stripe manual-capture (authorize $4.99, generate preview, capture on approval — 7-day hold window). Cap free regenerations at 1 (stills only). Refunds cost ~$2.90 each all-in (Stripe keeps original fees) — make the promised policy "fix first, refund second." Modeled monthly P&L at current prices with the fixed ladder: **~$70 net at 100 episodes/mo, ~$260 at 500, ~$1,250 at 2,000 — roughly doubling on its own as video prices fall.**

---

## 1. Economics, Deeply

### 1.1 Verified pipeline pricing (July 2026)

All prices below are **verified** from provider pages or multiple independent pricing trackers as of July 31, 2026.

| Model | Role | Replicate price | Direct / other providers |
|---|---|---|---|
| `google/nano-banana-pro` (Gemini 3 Pro Image) | Stills | ~$0.15 / image (our observed billing; matches list) | Google Gemini API: **$0.134**/1–2K image, $0.24/4K; **$0.067 batch** ([AI Free API pricing breakdown](https://www.aifreeapi.com/en/posts/nano-banana-pro-latest-price), [LaoZhang guide](https://blog.laozhang.ai/en/posts/nano-banana-pro-pricing)) |
| `google/nano-banana` (Gemini 2.5 Flash Image) | Budget stills | **$0.039** / image | Same on Google direct — $30/1M output tokens, 1,290 tokens/image ([Google Developers Blog](https://developers.googleblog.com/en/introducing-gemini-2-5-flash-image/)) |
| `kwaivgi/kling-v2.5-turbo-pro` | 5s clips | **$0.35 / 5s video** ($0.07/s extra) ([llm-stats](https://llm-stats.com/models/kling-v2.5-turbo-pro), [Renderful Kling pricing](https://renderful.ai/blog/kling-api-pricing)) | Identical $0.35/5s on [fal.ai](https://fal.ai/models/fal-ai/kling-video/v2.5-turbo/pro/image-to-video) |
| `google/lyria-2` | 30s music | ~$0.10 / track (our observed) | **$0.06 / 30s** on Google Cloud ([Lyria API docs](https://docs.cloud.google.com/gemini-enterprise-agent-platform/reference/models/lyria-music-generation)) |
| `minimax/hailuo-2.3-fast` | Budget clips | ~$0.19 / 6s @768p (fal list; Replicate comparable) ([fal.ai model page](https://fal.ai/models/fal-ai/minimax/hailuo-2.3-fast/standard/image-to-video)) | ≈ **$0.032/s** — 55% below Kling 2.5 |
| `wan-video/wan-2.5-i2v` | Budget clips (alt) | **$0.05/s @480p, $0.10/s @720p, $0.15/s @1080p** ([MaxVideoAI](https://maxvideoai.com/models/wan-2-5), [Replicate WAN collection](https://replicate.com/collections/wan-video)) | 480p = $0.25/5s clip |
| `google/veo-3.1` | Premium clips, native audio | **$0.40/s with audio (Standard), $0.15/s (Fast)** — Gemini API list, mirrored by resellers ([CostGoat](https://costgoat.com/pricing/google-veo), [MindStudio comparison](https://www.mindstudio.ai/blog/veo-3-1-vs-veo-3-1-fast-vs-veo-3-1-light-comparison)) | 4/6/8s durations, 720p/1080p, 16:9 or 9:16 ([Replicate model page](https://replicate.com/google/veo-3.1)) |
| Kling 3.0 (released Feb 5, 2026) | Premium clips | Not yet on Replicate as of this check | **$0.084/s Standard, $0.112/s Pro** on fal; from $0.075/s on aggregators ([Atlas Cloud review](https://www.atlascloud.ai/blog/guides/kling-3.0-review-features-pricing-ai-alternatives), [EvoLink](https://evolink.ai/blog/kling-3-o3-api-official-discount-pricing-developers)); 4K, 60fps, 15s, multi-shot ([InVideo guide](https://invideo.io/blog/kling-3-0-complete-guide/)) |

Notes:
- Replicate's own [pricing page](https://replicate.com/pricing) bills official models per input/output; volume discounts exist but only via [enterprise committed-spend contracts](https://replicate.com/enterprise).
- The Nano Banana Pro model page warns it "may at times be at capacity" and offers an `allow_fallback_model` flag ([Replicate](https://replicate.com/google/nano-banana-pro)) — build the fallback to non-Pro into the pipeline deliberately rather than letting Replicate pick.
- Stripe online card fee: **2.9% + $0.30** ([stripe.com/pricing](https://stripe.com/pricing)). On refunds, **Stripe keeps the original processing fee** ([Stripe refunds doc](https://docs.stripe.com/refunds)).

### 1.2 Three quality tiers — bill of materials per 30-second episode

Modeled episode = 2 stills (character ref + title card) + 5 clips (~25–30s footage) + 1 music track. *The $/episode figures are our estimates built from the verified unit prices above; Chad's observed production COGS of $1.55–2.00 for the Standard stack (4–5 clips) validates the model.*

| Tier | Stills | Video | Music | Episode COGS |
|---|---|---|---|---|
| **Budget** | 2 × nano-banana @ $0.039 = $0.08 | 5 × Hailuo 2.3 Fast 6s @ $0.19 = $0.95 (or Wan 2.5 480p: $1.25) | Lyria $0.06 | **≈ $1.05–1.40** |
| **Standard** (current) | 2 × nano-banana-pro @ $0.15 = $0.30 | 5 × Kling 2.5 @ $0.35 = $1.75 | Lyria $0.06–0.10 | **≈ $1.90** (observed $1.55–2.00 at 4–5 clips) |
| **Premium A** — Kling 3.0 | $0.30 | 25s @ $0.075–0.112/s = $1.88–2.80 (multi-shot, 4K) | Lyria $0.06 | **≈ $2.25–3.15** |
| **Premium B** — Veo 3.1 Fast | $0.30 | 4 × 8s @ $0.15/s = $4.80 **with native audio/SFX/dialogue** | not needed | **≈ $5.15** |
| (Veo 3.1 Standard) | $0.30 | 32s @ $0.40/s = $12.80 | — | ≈ $13.10 — uneconomic below ~$30 retail |

Budget-tier quality note: Hailuo 2.3 Fast is 768p and visibly softer than Kling; it is good enough for mid-season "weekly drop" episodes where the character is already established, not for the first episode a customer ever sees.

### 1.3 Per-SKU margin tables (the season-pass problem)

Stripe on each ticket: $4.99 → $0.44; $9.99 → $0.59; $19.99 → $0.88. Pledges per `marketing-copy.md` ledger: $1.00 / $2.50 / $5.00. SKU episode counts as currently written: 1 / 3 / 10.

**Standard tier ($1.90/episode) — current SKU definitions:**

| SKU | Price | Stripe | COGS | Gross margin | Pledge | **Net contribution** |
|---|---|---|---|---|---|---|
| Single (1 ep) | $4.99 | $0.44 | $1.90 | $2.65 (53%) | $1.00 | **+$1.65 (33%)** |
| 3-pack (3 eps) | $9.99 | $0.59 | $5.70 | $3.70 (37%) | $2.50 | **+$1.20 (12%)** |
| Season (10 eps) | $19.99 | $0.88 | $19.00 | $0.11 (0.5%) | $5.00 | **−$4.89 (−24%)** |

**Budget tier ($1.10/episode):** Single +$2.45 (49%) · 3-pack +$3.60 (36%) · 10-ep season +$3.11 (16%).
**Premium A ($2.70/episode):** Single +$0.85 (17%) · 3-pack **−$1.20** · season **−$13.9**.
**Premium B / Veo Fast ($5.15/episode):** negative at every current price point; viable only as a **$14.99 "Deluxe Episode"** → $14.99 − $0.73 Stripe − $5.15 − $1.00 pledge = **+$8.11 (54%)**.

**Recommended ladder (estimate, keeps Chad's price points):**

| SKU | Contents | COGS | Net after Stripe + pledge |
|---|---|---|---|
| $4.99 Single | 1 Standard ep | $1.90 | **+$1.65 (33%)** |
| $9.99 3-pack | 1 Standard + 2 Budget | $4.10 | **+$2.80 (28%)** |
| $19.99 Season | 6 eps: 1 Standard premiere + 5 Budget weeklies | $7.40 | **+$6.71 (34%)** |
| $14.99 Deluxe (optional) | 1 Veo 3.1 Fast ep w/ native audio | $5.15 | **+$8.11 (54%)** |

If the season must stay at 10 episodes, price it $29.99 (net +$11.6 with the mixed-tier BOM). **And fix the copy: `marketing-copy.md` promises ~10-minute episodes; 10 minutes of Kling 2.5 is ~$42 of video per episode ($0.07/s × 600s). Even 3 minutes is ~$12.60.** The sellable format at these prices is 30–90 seconds — say so on the site, or refunds will do the correcting for us.

### 1.4 Cost trajectory 2024 → 2026, and the next 12–24 months

**Verified price declines (constant or improving quality):**

| Model class | Then | Now | Decline |
|---|---|---|---|
| Veo 3 w/ audio | $0.75/s at May 2025 launch | $0.40/s (Sept 2025 cut) | **−47% in ~4 months** ([The Decoder](https://the-decoder.com/google-cuts-api-prices-for-veo-3-by-up-to-60-percent/)) |
| Veo 3 Fast w/ audio | $0.40/s | $0.15/s | **−62% in ~4 months** ([Neowin](https://www.neowin.net/news/google-veo-3-and-veo-3-fast-models-get-a-price-cut-and-new-video-features/)) |
| Wan i2v 480p | $0.09/s (Wan 2.1, early 2025, [Replicate pricing page](https://replicate.com/pricing)) | $0.05/s (Wan 2.5) | −44% in ~1 year |
| Kling $/quality | Kling 2.5: $0.07/s, 1080p, 10s max | Kling 3.0 (Feb 2026): $0.075–0.112/s but **4K, 60fps, 15s, multi-shot** ([InVideo](https://invideo.io/blog/kling-3-0-complete-guide/)) | ~flat $/s for a generational quality jump |
| Frontier image gen | DALL·E 3 HD (2024): $0.08–0.12/img | Nano Banana: $0.039; Pro-class via resellers: ~$0.05 ([AI Free API](https://www.aifreeapi.com/en/posts/nano-banana-pro-latest-price)) | −50–70% over ~18 months |

Industry trackers now put production-quality video at $0.07/s (Kling) vs. Sora 2's $0.10/s and Runway Gen-4.5's $0.12/s ([FluxNote 2026 pricing guide](https://fluxnote.io/guides/ai-video-model-pricing-comparison-2026)).

**12–24 month projection (our estimate):** at the observed ~45–60%/year decline at constant quality, a Standard episode falls from ~$1.90 to **~$0.95–1.20 by mid-2027**, and today's Premium (native-audio Veo-class) falls into the current Standard price band. If video costs halve with prices unchanged: single margin 33% → 43% after pledge; the recommended $19.99 six-episode season goes from +$6.71 to **+$10.4 (52%)**. Every SKU gets structurally better without touching prices.

**Bear case (take seriously):**
1. **Providers exit or reprice upward.** OpenAI announced the shutdown of Sora on March 24, 2026 — it reportedly cost ~$1M/day to run against ~$2.1M lifetime revenue ([TechCrunch](https://techcrunch.com/2026/03/29/why-openai-really-shut-down-sora/), [OpenAI Help Center](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation)). Today's video prices are subsidized by a land-grab; some will correct *up*, and models get deprecated with 30–90 days' notice.
2. **The quality bar rises faster than prices fall.** If customers come to expect native audio + dialogue (Veo-class) as table stakes, "Standard" becomes $4–5/episode, not $1.90, and the $4.99 single compresses to near-zero margin. The Deluxe SKU exists partly to discover willingness-to-pay for that future.
3. **Capacity risk.** Nano Banana Pro already hits capacity limits with forced fallbacks ([Replicate model page](https://replicate.com/google/nano-banana-pro)). Peak (Q4 gift season) is exactly when capacity gets tight.

### 1.5 Fixed costs and break-even

**Fixed monthly overhead (verified list prices):**

| Phase | Items | $/month |
|---|---|---|
| Launch | Vercel Pro $20 (Hobby prohibits commercial use — [vercel.com/pricing](https://vercel.com/pricing)); Supabase Free $0; Cloudflare R2 storage ~$2 (130 GB @ $0.015/GB-mo, zero egress — [R2 pricing](https://developers.cloudflare.com/r2/pricing/)); domain ~$1; YouTube Data API $0 (default 10,000 units/day free; one upload = 1,600 units ≈ 6 uploads/day, higher quota by free request — [YouTube API docs](https://developers.google.com/youtube/v3/getting-started)) | **~$25–50** |
| Growth | + Supabase Pro $25 ([supabase.com/pricing](https://supabase.com/pricing)), Resend email $20, monitoring/tools ~$50, bookkeeping ~$100 | **~$250** |
| Scaled | + part-time support, compliance filings amortized, higher storage | **~$600–1,000** |

**Break-even sensitivity (orders/month needed to cover overhead; using net contribution per order after COGS, Stripe, and pledge):**

| Contribution per order | $50 overhead | $250 | $1,000 |
|---|---|---|---|
| $1.65 (all singles, Standard) | 31 | 152 | 607 |
| $2.69 (recommended mix — see §4.2) | 19 | 93 | 372 |
| $6.71 (all seasons, fixed ladder) | 8 | 38 | 149 |

Even the worst case — all-singles at launch overhead — breaks even at **~1 sale/day**. The business risk is not overhead; it is CAC (see §3) and leak control (see §4).

### 1.6 Provider risk: Replicate vs fal.ai vs direct APIs

- **Kling 2.5:** identical $0.35/5s on Replicate and [fal.ai](https://fal.ai/models/fal-ai/kling-video/v2.5-turbo/pro/image-to-video) — no arbitrage today, but fal has Kling 2.6 Pro (native audio) and 3.0 first; Replicate lags on Kling releases.
- **Google models:** direct Gemini API is cheaper — Nano Banana Pro $0.134 vs $0.15 (−11%), batch $0.067 (−55%, fine for non-interactive regeneration jobs), Lyria $0.06 vs ~$0.10 (−40%). At 2,000 episodes/month, moving stills+music to Google direct saves ~$25–90/mo — worth doing once volume justifies a second integration.
- **Aggregators/resellers** (Kie.ai, EvoLink, etc.) advertise 50–70% below list for Veo/Kling; treat as tier-3 fallback only — uptime and ToS risk, and some resell through gray channels.
- **Volume discounts:** Replicate and fal both negotiate only at enterprise/committed spend ([Replicate enterprise](https://replicate.com/enterprise)). At 100–500 eps/mo ($190–950/mo model spend at Standard) we're below negotiation thresholds; at 2,000 eps/mo (~$3.8k/mo) we're close — open the volume-discount conversation with both Replicate and fal at ~$3–5k/mo and let them bid.
- **When multi-provider redundancy pays:** immediately, but cheaply — keep the existing model-adapter abstraction, add fal.ai as a warm standby for Kling (same API shape, same price), and Google direct for stills/music. Cost: a few hours of code. The Sora shutdown and Replicate capacity fallbacks are the argument; don't wait for the outage during gift season.

---

## 2. Charity Structure — "On the Up and Up," While Covering Expenditures and Payroll

Everything here is **research to bring to a nonprofit/tax attorney**, not legal advice. The bottom line up front: Chad's instinct ("a 501(c)(3)") is the wrong vehicle for the *product company*, and the right vehicle for a *later sibling foundation*. Here's why, with the mechanics of both.

### 2.1 Why a 501(c)(3) that sells cartoons is the wrong vehicle: UBIT and the commerciality doctrine

**UBIT (IRC §§511–513).** A 501(c)(3) pays corporate income tax on income from a trade or business that is regularly carried on and **not substantially related** to its exempt purpose. "Related" means the *activity itself* accomplishes charity — critically, **using the profits for charity does not make the activity related** (the "destination of income" theory was rejected when Congress enacted UBIT in 1950; see [Freeman Law's UBIT series](https://freemanlaw.com/tax-exemption-and-unrelated-business-income-rules-ubit-substantially-related-part-3-of-3/)). Selling personalized cartoon videos to dog owners does not itself shelter, feed, or rehome animals — it is fundraising via commerce. At best it's UBI taxed at 21%; at worst it's disqualifying, because:

**The commerciality doctrine.** Courts deny or revoke exemption when an organization's activities are pursued in a commercial manner in competition with for-profits:
- *Better Business Bureau v. United States*, 326 U.S. 279 (1945): "the presence of a single [substantial] non-exempt purpose … destroys the exemption regardless of the number or importance of truly [exempt] purposes."
- *Living Faith, Inc. v. Commissioner*, 950 F.2d 365 (7th Cir. 1991): exemption denied to a church-affiliated operator of health-food stores/restaurants. The IRS calls this the "best contemporary explanation" of the doctrine; the bad factors — selling goods to the general public, direct competition with for-profits, retail pricing formulas, promotional materials and "commercial catchphrases" — describe PupTV's storefront exactly ([IRS Exempt Organizations issue podcast transcript](https://www.irs.gov/charities-non-profits/stay-exempt/issue-podcast-when-are-commercial-type-activities-a-substantial-nonexempt-purpose-for-an-irc-501c3-organization-video-transcript)).
- *Airlie Foundation v. IRS*, 283 F. Supp. 2d 58 (D.D.C. 2003): conference center denied re-exemption for commercial operation despite charitable gloss ([Nonprofit Law Blog summary](https://nonprofitlawblog.com/commerciality-doctrine-denial-exemption/), [Charity Lawyer Blog overview](https://charitylawyerblog.com/2009/11/08/501c3-organizations-and-the-commerciality-doctrine/)).

PupTV competes directly with DreamPets, Pawtograph, and every AI pet-video app (see `competitors.md`), prices at retail, and advertises. An exemption application describing that honestly invites denial; describing it dishonestly is worse. **Conclusion: the storefront must be for-profit.** A nonprofit *could* run it as taxable UBI, but if the store is the *primary* activity, exemption itself is at risk — there's no version where the main thing PupTV does lives comfortably inside a 501(c)(3).

### 2.2 501(c)(3) mechanics anyway (for the Phase-2 foundation)

- **Form 1023-EZ:** $275 fee, eligible only if projected gross receipts ≤ $50k/yr for the next 3 years (and past 3), assets ≤ $250k; 80% of determinations issue within **22 days** ([IRS: Where's my application](https://www.irs.gov/charities-non-profits/charitable-organizations/wheres-my-application-for-tax-exempt-status), [1023-EZ eligibility](https://www.501c3.org/eligible-file-form-1023-ez/)).
- **Full Form 1023:** $600 fee; 80% within **191 days** (3–6 months typical) ([Exempt Nexus processing times](https://form1023.org/how-long-the-irs-takes-to-process-form-1023-for-501c3)). If the foundation will receive >$50k/yr from PupTV profits, EZ is off the table.
- **Texas formation:** Certificate of Formation – Nonprofit Corporation (Form 202), **$25** ([TX SOS instructions](https://www.sos.state.tx.us/corp/instructions/202.shtml)). Then apply to the Comptroller for franchise & sales tax exemption (Form AP-204, citing the federal determination letter) ([TX nonprofit filing guide](https://www.taxzerone.com/nonprofit-taxes/texas-state-filing-requirements/)). Texas has **no general charitable-solicitation registration statute** (only narrow regimes for veterans/public-safety-themed solicitation).
- **Other states do:** ~40 states + DC require charitable solicitation registration before soliciting their residents, and a nationwide "Donate" button is treated under the **Charleston Principles** as soliciting wherever donors are targeted or contributions become repeated/substantial ([Foundation Group multi-state guide](https://www.501c3.org/navigating-multi-state-charitable-solicitations-a-comprehensive-guide-for-nonprofits/), [Harbor Compliance on online fundraising](https://www.harborcompliance.com/online-fundraising-charleston-principles)). Full 40-state registration runs $3–6k/yr through services — a real recurring cost the Phase-1 for-profit path avoids entirely (a company *selling a product* with a giving pledge is not "soliciting charitable contributions"; it's doing a charitable sales promotion — see §2.3).
- **Public support test:** to be a public charity under §509(a)(1)/(2) the foundation needs broad support (roughly ⅓ public). **A foundation funded almost entirely by PupTV LLC's profits fails that and defaults to private foundation status** — still a legitimate 501(c)(3), but with excise tax on investment income, 5% minimum distributions, and strict self-dealing rules (IRC §4941) between it and Chad/the LLC. Plan for this: either accept PF status (fine for a grantmaking checkbook) or build genuine public donations (customer round-ups, direct gifts) to pass the test. Bring this specific question to the attorney.

### 2.3 The likely-correct structure: for-profit seller + CCV-compliant giving

**Entity:** either a new single-member **PupTV LLC** (TX Certificate of Formation, $300) or an assumed name **"PupTV" under Dominium Group, LLC** (~$25 filing). A separate LLC is cleaner: isolates liability (consumer product, AI content, YouTube ToS), keeps books separable for the pledge audit trail, and doesn't entangle Ironclad Doors' banking. *Estimate: separate LLC is worth the $300.*

**The legal frame for "buy an episode, we donate to the rescue you pick":** that is a **charitable sales promotion**, making PupTV a **commercial co-venturer (CCV)** — a for-profit that advertises that a purchase will benefit a charity. Regulation is state-by-state ([Harbor Compliance CCV guide](https://www.harborcompliance.com/commercial-coventurers-registration-licensing), [Cogency Global primer](https://www.cogencyglobal.com/blog/charitable-sales-promotions-a-primer-for-charities-and-commercial-co-venturers/), [Change's state directory](https://getchange.io/resources/commercial-co-venturer-directory), [Perlman & Perlman chart](https://perlmanandperlman.com/wp-content/uploads/2025/03/CCV-Registration-Chart.pdf)):

| State | Requirement |
|---|---|
| **Massachusetts** | Register ($200/yr) + **$25,000 surety bond** + file the written contract |
| **Alabama** | Register ($100/yr) + **$10,000 surety bond** |
| **South Carolina** | Registration statement + contract filing |
| **California** | Registration ($200) *or* comply with contract/accounting/disbursement rules in lieu (Cal. B&P §17510.8: transfer funds every 90 days, accounting to the charity) |
| **Hawaii, Illinois, Mississippi** | Written contract and/or contract filing; no bond |
| Other ~43 states incl. **Texas** | No CCV registration; general deceptive-practices law applies (in TX, the DTPA) |

Practical Phase-1 posture (*our estimate of the proportional approach; confirm with counsel*): (1) execute a short **written agreement with every rescue that appears in the charity picker** — that single habit satisfies the core of CA/HI/IL/MS and is what the states are really after; (2) disburse at least quarterly with an accounting to each charity; (3) hold off on paid advertising *into* MA and AL until revenue justifies the bonds (~$100–300/yr premium each) — a surety bond + $300/yr in fees is the entire cost of full compliance when we get there.

**Disclosure rules for the claim itself** (this is where "on the up and up" lives or dies):
- State a **flat per-unit dollar amount** — "$1.00 of every episode goes to the rescue you choose" — not "a portion of proceeds." BBB Wise Giving Standard 19 requires the actual per-unit amount, the promotion's duration, and any caps ([Engage for Good: 10 legal requirements](https://engageforgood.com/10-cause-marketing-legal-requirements/)).
- The NY AG's **"Five Best Practices for Transparent Cause Marketing"** says the same: per-unit dollars, clearly displayed, on every ad ([Engage for Good summary](https://engageforgood.com/for-goodness-sake-legal-regulation-and-best-practices-in-the-field-of-cause-marketing/)).
- The FTC has prosecuted "portion of proceeds" claims where donations weren't actually made (EarthRite cleaning products — claimed donations, paid none) as straight deception ([FTC advertising enforcement materials](https://www.ftc.gov/sites/default/files/attachments/training-materials/enforcement.pdf)). The exposure isn't the structure — it's ever failing to pay what the site says.
- Good news: the current `marketing-copy.md` ledger ($1.00 / $2.50 / $5.00 per SKU, published weekly) is already the right *shape*. Two fixes: the About page says "One percent of every sale" while the ledger table says ~20–25% — **reconcile these before launch**; and change "Proceeds go to dog rescues" on the Season SKU to the flat dollar amount.

### 2.4 Alternative: sibling 501(c)(3) foundation — honest comparison

| | Phase 1: LLC + CCV pledge | Phase 2: LLC + sibling PupTV Foundation |
|---|---|---|
| Setup cost | ~$300 LLC + ~$1–2.5k legal review of promo terms | + $25 TX + $600 IRS + $1.5–5k attorney + annual 990 prep ($500–1.5k) |
| Time to launch | 1–2 weeks | 3–7 months for determination (can launch Phase 1 meanwhile) |
| Customer tax deduction | None (they bought a product, not a gift) | None for purchases either! Only *direct donations to the foundation* are deductible |
| Marketing power | "$1 per episode to the rescue you pick" | "…via the PupTV Foundation, a 501(c)(3)" — stronger halo, grant-eligible |
| Compliance load | Contracts + disclosures + 2 bonds eventually | + Form 990 (public), board, minutes, possible 40-state solicitation registration if it fundraises directly, private-foundation rules if support is all from the LLC |
| Founder pay | Unrestricted (LLC) | LLC side unrestricted; foundation side reasonable-comp only |
| Failure mode | Deception claim if pledge unpaid | Same, plus IRS revocation / §4958 / self-dealing exposure |

The foundation adds trust and grant access but **does not make customer purchases deductible** — the most-cited reason to want one evaporates on inspection. It earns its keep only when (a) donations processed are large enough that rescues/grantmakers want a c3 counterparty, or (b) we want to accept direct tax-deductible gifts and employer matches. Hence: Phase 2, not Phase 1.

### 2.5 Payroll and overhead legality — how founders get paid in each structure

**In the LLC (Phase 1):** salary, guaranteed payments, distributions — all unrestricted and ordinary. The *only* charitable-law constraint is truth-in-advertising: the pledged dollars must actually be paid on schedule. The pledge is a marketing expense of doing business; the company (not the customer) generally deducts its donations — as advertising/sponsorship expense when made pursuant to the sales promotion, or as charitable contributions subject to deduction limits — a CPA question with real dollars attached; flag it for tax prep.

**In a 501(c)(3) (Phase 2):** founders/directors are "disqualified persons" under **IRC §4958**. Compensation must be *reasonable* (FMV for services actually rendered). Overpaying triggers intermediate sanctions: the person repays the excess **plus a 25% excise tax, escalating to 200%** if uncorrected, and approving managers face 10% (up to $20k) ([IRS: Intermediate sanctions](https://www.irs.gov/charities-non-profits/charitable-organizations/intermediate-sanctions-excess-benefit-transactions)). Protection is the **rebuttable presumption of reasonableness** (Treas. Reg. §53.4958-6): (1) advance approval by an independent board (Chad recused), (2) written comparability data (salary surveys for similar roles/budgets), (3) contemporaneous minutes ([Nonprofit Law Blog procedure guide](https://nonprofitlawblog.com/rebuttable-presumption-of-reasonableness-procedures/)). Compensation of officers/key employees is publicly disclosed on **Form 990 Part VII**, and the 990 asks directly whether any excess-benefit transaction occurred. Also note: **any services the LLC sells to the foundation (or vice versa) must be at documented arm's-length pricing** — the IRS looks hard at for-profit/nonprofit tandems that share founders.

### 2.6 The charity picker: honoring donor designation properly

**In the Phase-1 for-profit model** the customer's pick is **a contractual promise by PupTV, not a restricted charitable gift** — the customer never makes a donation; PupTV does. Mechanics to make it airtight:
1. **Track designations per order** (order → rescue EIN) and disburse **monthly or quarterly** with a per-rescue accounting (CA's 90-day rule is a good universal default).
2. **Vet every rescue in the picker** against the IRS Tax Exempt Organization Search (Pub 78 data — confirms 501(c)(3) status and deductibility) and [Candid](https://candid.org) profiles; collect a W-9; screen names against OFAC. Drop any org that loses exemption (auto-revocation list).
3. **Publish the ledger** (already promised in marketing copy): month, rescue, amount, check/ACH reference. This converts the compliance duty into a marketing asset.
4. **Reserve substitution rights in the T&Cs**: "if a selected rescue is ineligible or unresponsive for 90 days, we donate to [default partner]." This is the for-profit analog of a nonprofit's *variance power* ([Nonprofit Accounting Basics on designated contributions](https://www.nonprofitaccountingbasics.org/contributions/whose-money-it-recording-contributions-held-others)) — without it, one dissolved rescue strands pledged funds.
5. **No deductibility implications for the customer** — never hint otherwise; no receipts language beyond "PupTV will donate $X to Y on your behalf."
6. **Optional add-on donations** (customer adds $5 for the rescue at checkout) are different: that *is* solicitation/processing of charitable funds. Don't hold those ourselves — route them through a donations API that grants via its own charity vehicle (e.g., [Change](https://getchange.io), which also handles Pub 78 vetting, disbursement, and receipts). If we later want round-ups, this is the plumbing.

**If/when the Foundation runs the picker (Phase 2):** designations become **donor-restricted funds** — legally enforceable by state AGs; they must be tracked as restricted in the books and spent per intent, with written variance power reserved in the gift acceptance policy ([Charity Lawyer Blog on managing restricted gifts](https://charitylawyerblog.com/2014/04/14/managing-donor-restricted-gifts/), [YPTC restricted-funds guide](https://www.yptc.com/donor-restricted-funds/)).

### 2.7 Recommended path, phased, with costs

- **Phase 0 (this month, ~$0):** reconcile the marketing copy's charity math (1% vs ledger); rewrite claims as flat per-unit dollars; draft the standard rescue agreement + T&C substitution clause.
- **Phase 1 (launch, ~$1.5–3k):** form PupTV LLC ($300) or Dominium dba ($25); attorney review of promotion terms and rescue contract ($1–2.5k); build the vet-check (Pub 78 + W-9) into rescue onboarding; monthly disbursement + public ledger. Skip MA/AL advertising until bonded.
- **Phase 1.5 (~$500–800/yr when advertising nationally):** MA + AL CCV registrations and bonds; CA registration ($200) or §17510.8 compliance-in-lieu.
- **Phase 2 (at ~$50k+/yr flowing to rescues or when grant/partner demand appears, ~$2.5–6k + ~$1–2k/yr):** stand up PupTV Foundation (TX Form 202 $25, Form 1023 $600, attorney, 990s). Decide private-foundation vs public-charity posture with counsel (§2.2). LLC covenants a stated share of profits to the Foundation; Foundation runs the grantmaking and (only then) any direct fundraising, registering for solicitation where it actually solicits.

---

## 3. Marketing

### 3.1 Buyer 1 — dog owners 55+ (Facebook / YouTube country)

Platform reality (Pew Research, Nov 2025): **57% of Americans 65+ use Facebook and 64% use YouTube** — the only two platforms a majority of every age group uses; older adults concentrate almost entirely on these two ([Pew: Americans' Social Media Use 2025](https://www.pewresearch.org/internet/2025/11/20/americans-social-media-use-2025/)). PupTV *delivers* on YouTube — the discovery channel and the delivery channel are the same place.

**Verified Meta benchmarks (2026):** pets niche CPM **$9.56** with one of the highest conversion rates of any vertical (1.53%) ([Lebesgue Facebook benchmarks](https://lebesgue.io/facebook-ads/facebook-benchmarks-by-industry-ctr-cpm-cr-and-cac)); US ecommerce CPM ~$14–16, average CPC **$1.72** (Instagram Reels $1.28), median ecommerce CPA **$29.99** ([DigitalApplied 2026 benchmarks](https://www.digitalapplied.com/blog/facebook-ads-benchmarks-2026-cpc-cpm-ctr-industry), [AdManage cost guide](https://admanage.ai/blog/how-much-does-it-cost-to-advertise-on-facebook)).

**CAC math (our estimates from those benchmarks):** at $9.56 CPM, 1.5% CTR → $0.64 CPC; at a 3% cold-landing conversion → **CAC ≈ $21**. Best plausible case (3% CTR — pet content earns it — and 5% CVR): **CAC ≈ $6.40**. Against $1.65 contribution on a single, cold paid acquisition loses money in every scenario; against the fixed season SKU ($6.71) or Deluxe ($8.11) it's marginal-to-workable only with excellent creative. **Implication: the gift and season SKUs must carry all paid acquisition, and paid should wait until organic proves which creative converts.**

### 3.2 Buyer 2 — adult children (gift flow, TikTok / Reels)

**Verified TikTok benchmarks (2026):** CPM **$4.80–13.26** depending on source and vertical ($9.16 in-feed average — ~38% below Facebook), median CPC ~**$0.50** ([Lebesgue TikTok benchmarks](https://lebesgue.io/tiktok-ads/tiktok-ads-benchmarks-for-ctr-cr-and-cpm), [WebFX TikTok benchmarks](https://www.webfx.com/blog/social-media/tiktok-benchmarks/)). Reels CPM $9–14.

The unfair advantage: **the product output is the ad creative.** Every episode is a ready-made vertical clip ("POV: my mom's Frenchie got his own cartoon show… she cried"). Post organic daily at $0 media cost; put money only behind Spark-boosting whichever organic clip already works. The purchase trigger for this buyer is emotional gifting (birthdays, Mother's Day, holidays) — build the gift flow copy (already drafted in `marketing-copy.md`) into every clip's CTA.

### 3.3 Zero/low-cost engines (the actual plan)

1. **Rescue partnerships — the donation IS the CAC.** Offer rescues: co-branded landing page + their own link; every episode sold through it designates $2 (not $1) to them; they email their donor list and post to their Facebook following (rescue donors skew 55+ female — exactly buyer 1). Precedents that this converts: iHeartDogs' storefront funds shelter-meal donations through Greater Good Charities and built the whole brand on it ([iHeartDogs social impact](https://iheartdogs.com/social-impact/), [Greater Good partnership](https://greatergood.org/feed-shelter-animals-with-goods-iheartdogs)); BarkBox runs a standing rescue-and-shelter program ([BarkBox](https://rescueandshelter.splashthat.com/)). Start local: 3 North Texas rescues (e.g., Operation Kindness, SPCA of Texas affiliates) where Chad can get a yes in one phone call. Give each rescue a free episode of a real adoptable dog — their share posts are demos.
2. **The built-in viral loop.** Every published episode on a customer's public YouTube channel is a persistent demo with our name on it. Add a tasteful 2-second end-card ("Made at PupTV.com — $1 of every episode funds rescues") and a link in every video description the pipeline writes. Zero cost, compounds forever.
3. **Nano pet-influencer seeding.** Pet nano/micro accounts charge $50–300/Reel, and nano creators commonly accept product gifting ([InfluencerFee pet pricing](https://influencerfee.com/blog/pet-influencer-pricing/), [Influee rate guide](https://influee.co/blog/instagram-influencer-pricing)). Our product is digital: **seeding an influencer costs ~$2 of COGS.** Gift 20–30 episodes to nano dog accounts (1k–50k followers) for an honest post; pay cash only to the 2–3 whose audiences convert.
4. **PR.** "Grandma's dog has its own cartoon show — and it funds rescues" is a ready-made local-TV/lifestyle segment (Dallas market first: WFAA Good Morning Texas, CultureMap, local senior-living media), plus pet trades and 'gifts for seniors' listicles in Q4. Cost: time.
5. **YouTube organic on our own channel.** Publish the best customer episodes (with permission) + a "how it works for a 70-year-old" explainer. 64% of 65+ are already there.

### 3.4 First 90 days, < $1,000 total

- **Days 0–30 ($0–100):** Fix the economics/claims (season SKU, 10-minute promise, per-unit disclosure). Instrument the funnel (preview→pay conversion, COGS per order). Sign 3 Dallas-area rescues with the standard agreement; ship their co-branded pages. Produce 10 seed episodes (~$20 COGS) of adoptable dogs for launch content. Set up TikTok/IG/FB/YouTube accounts, post 3×/week from seed content.
- **Days 31–60 (~$300):** Gift episodes to 25 nano pet influencers (~$50 COGS + outreach time). First rescue email blasts go out. PR pitch wave 1 (local TV + pet blogs). $150 Meta retargeting on site visitors + $100 TikTok Spark boost on the best organic clip. Measure CAC by channel.
- **Days 61–90 (~$500):** Double down on the single best channel from the data. Launch the repriced Season + Deluxe SKUs. Lock a Q4 gift-season plan (this is a gifting product; November–December will be most of the year's revenue — *estimate*). Decision point: if >$4k/yr is flowing to rescues, start Phase 1.5 CCV registrations and scope Phase 2.

---

## 4. Guardrails Against Losing Money

### 4.1 Where the current design leaks, with numbers

| Leak | Cost today | Mitigation | Cost after |
|---|---|---|---|
| **Free pre-payment preview stills** (3 × Nano Banana Pro) | $0.45 per abandoner. At 10% preview→purchase, that's **$4.05 of preview spend per sale** — more than double the $1.65 contribution. At 30% conversion, $1.05/sale. | (a) One watermarked, low-res preview still from **non-Pro** Nano Banana ($0.039); upgrade to Pro stills only after payment. (b) Better: **Stripe manual capture** — authorize the $4.99 at upload, generate previews, capture on approval; the hold is good for 7 days ([Stripe: place a hold](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method)). Authorized users convert far higher, and tire-kickers never trigger GPU spend. | $0.04–0.35/sale (est.) |
| **Unlimited/scripted preview abuse** | An unprotected preview endpoint is a $0.45-per-call faucet for bots | Email verification + per-IP/day caps + Cloudflare Turnstile before any model call | ~$0 |
| **Regeneration requests** (FAQ promises "we regenerate the episode… no extra charge") | Full-episode regen = full COGS ($1.90) per request, unbounded | Promise scoped: 1 free *character fix* regenerating stills + affected clips only (~$0.50–0.85); further regens $1.99; taste-based ("make it funnier") regens always paid | ≤$0.85/order once |
| **30-day no-questions refunds** | Refund = lose sale, keep COGS ($1.90), Stripe keeps original fee (~$0.44) ([Stripe refunds](https://docs.stripe.com/refunds)), pledge already owed ($1 — honor it anyway; clawing back a rescue donation is a PR grenade) → **~$2.90–3.35 hard cost per refund** | Keep a generous-sounding but structured policy: 14 days, "we fix it first" (one free regen), refund as the fallback. Alert threshold: refund rate >5% | ~halved incidence (est.) |
| **The 10-minute-episode promise** (see §1.3) | Fulfillment as written costs ~$43/episode → −$38 per $4.99 sale, or a wave of refunds | Fix the copy to the real format before launch | $0 |
| **Season pass as specced** | −$4.89/sale (§1.3) | 6-episode mixed-tier season or $29.99 | +$6.71/sale |
| **Model capacity fallbacks** | Replicate can silently route Nano Banana Pro to a fallback and bill accordingly | Pin models explicitly; own the fallback logic (§1.6) | ~$0 |

**Design principle: video generation never runs before captured payment.** Stills are cheap enough to risk on authorized-but-not-captured orders; Kling/Veo clips are not. The expensive 90% of COGS should sit strictly behind capture.

### 4.2 Simple monthly P&L template (recommended ladder + Phase-1 structure)

Assumptions (*estimates*): order mix 60% Single / 25% 3-pack / 15% Season(6-ep) → 2.25 episodes and $8.49 revenue per average order; COGS per §1.2–1.3 (Standard singles/premieres, Budget weeklies); pledges $1/$2.50/$5; Stripe 2.9% + $0.30/order; preview+regen leak provisioned at $0.40/order.

| | **100 eps/mo** (≈44 orders) | **500 eps/mo** (≈222 orders) | **2,000 eps/mo** (≈889 orders) |
|---|---|---|---|
| Revenue | $377 | $1,887 | $7,547 |
| Stripe fees | −$24 | −$121 | −$485 |
| Model COGS | −$146 | −$727 | −$2,912 |
| Preview/regen provision | −$18 | −$89 | −$356 |
| Rescue pledges | −$88 | −$438 | −$1,756 |
| **Contribution** | **$101** | **$512** | **$2,038** |
| Fixed overhead (§1.5) | −$30 | −$250 | −$800 |
| **Net before founder pay/tax** | **≈ +$70** | **≈ +$260** | **≈ +$1,240** |
| — same, if video prices halve (§1.4) | +$140 | +$620 | +$2,690 |

Read it plainly: at current prices this is a **rescue-funding machine with a modest profit engine attached** — at 2,000 episodes/month it sends ~$21k/yr to rescues and nets ~$15k/yr before Chad's time. The paths to real operator income are (1) the cost curve (§1.4 doubles net by 2027 on its own), (2) the Deluxe/premium SKUs at $14.99+, (3) repeat occasions per dog (birthday, Gotcha Day, holiday specials — same customer, zero CAC), and (4) volume through rescue partnerships. That's an honest picture to carry into the lawyer and the launch.

---

## Appendix: Source Notes

Key sources are linked inline. Verified facts = provider pricing pages, IRS pages, statutes/cases, Pew, Stripe docs, and named industry benchmark reports (Lebesgue, DigitalApplied, WebFX), all retrieved July 31, 2026. Estimates = all episode BOMs, tier COGS, CAC scenarios, P&L mix, conversion rates, and cost-decline projections; they follow directly from the cited unit prices and stated assumptions and should be re-run against production telemetry after the first 100 paid orders. Legal/tax content (§2 throughout) is research for counsel, not advice; the specific questions to bring to the attorney are flagged in §2.2 (public support posture), §2.3 (CCV registration timing), and §2.5 (deduction treatment of pledge payments).
