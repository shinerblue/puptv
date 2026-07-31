# ToonTails — Third-Party Donation Verification

**Research date: July 31, 2026.** This is research for a business decision, not legal advice. Verified facts are pulled from provider pricing pages, help-center docs, and FAQ pages retrieved on this date (all linked inline); anything not directly sourced is labeled **estimate**. This document assumes the Phase-1 for-profit LLC + flat-per-unit-pledge structure from `docs/economics-and-structure.md` — ToonTails/PupTV LLC never becomes a 501(c)(3); it makes a contractual promise ("$1 of every episode") and needs an *outside party* to prove that promise was kept.

---

## The problem in one sentence

Right now, `/impact` shows a "Sample data" ledger that ToonTails itself wrote (`src/lib/impact.ts`). That is a self-reported claim — indistinguishable, to a skeptical customer or regulator, from a company that never pays out at all. The fix is routing every pledged dollar through a third party that (a) never lets ToonTails touch the money, (b) independently verifies the recipient is a real, IRS-recognized charity, and (c) generates a receipt/record ToonTails did not create and cannot edit.

---

## 1. Donation API / platform intermediaries

### 1.1 Pledge (pledge.to, formerly Pledgeling)

**What it is:** A donation-infrastructure company with both no-code products (Donation Forms, Fundraiser Pages) and a developer-facing **Donate API** for embedding giving into checkout flows ([Embedded Giving with Pledge APIs](https://www.pledge.to/products/apis)).

**Integration effort:** REST API (Donate API) — server-side call per donation event, works well for "customer buys episode → we programmatically pledge $1 on their behalf." Also has a Shopify app if ToonTails ever moves to Shopify.

**Fees (verified, [pledge.to/pricing](https://www.pledge.to/pricing), [API fee article](https://help.pledgeling.com/support/solutions/articles/36000233798-what-are-the-fees-for-donations-made-via-the-api-)):**
- No monthly or setup fee.
- **Donate API: 5% technology fee**, deducted from the donation.
- Card processing: **2.9% + $0.30** per aggregate charge (Pledge does *not* cover this fee on the API product — it only comps card fees on its own-branded Donation Forms/Fundraiser Pages).
- **$5/month disbursement fee** to cover ACH/check costs to nonprofits.
- Combined effective cost at our volumes: **~13% at $100/mo, ~9% at $500/mo, ~8% at $2,000/mo** of pledge dollars (see §4 table).

**Charity database & small TX rescues:** Pledge requires nonprofits to be **US 501(c)(3) "public charity" status with an IRS exemption letter**; if a rescue isn't already listed, you [request it be added](https://help.pledgeling.com/support/solutions/articles/36000036104-how-to-get-a-nonprofit-added-to-our-database) with website/EIN info — Pledge says review/approval is typically **1–2 business days**. Chapters need their own EIN to be added separately from a parent org.

**Donor-designation model:** the customer (or ToonTails, in our case) picks the recipient charity from Pledge's database at time of donation; Pledge's own Donor-Advised Fund (the Pledgeling Foundation) is the intermediary that actually holds/moves the money, which is what makes the donation "real" from a compliance standpoint — [Compliance solution page](https://www.pledge.to/solutions/compliance).

**Public verification artifact:** Automatic tax receipts (via the Pledgeling Foundation DAF), a donor-facing **Impact Hub** dashboard, and state charitable-registration coverage claimed "in all required states" — but this is a *dashboard we'd have to link to*, not an independently-hosted public ledger.

**Compliance:** Pledge markets itself as "industry's most compliant fundraising platform," claims state registration coverage and AB 488 compliance, but its CCV-specific product depth is less explicit than Change's (below) — no dedicated commercial-co-venturer page comparable to Change's.

---

### 1.2 Change (getchange.io, sometimes written getchange.io)

**What it is:** A donations-and-compliance API built specifically for companies running cause-marketing / checkout-donation programs — i.e., almost exactly the ToonTails use case. Change is **not a payment processor**: it invoices the company monthly for pledged donations, then grants the funds via its own donor-advised fund, **Our Change Foundation** ([pricing FAQ](https://getchange.io/pricing/companies)).

**Integration effort:** REST **Donations API** ([docs.getchange.io](https://docs.getchange.io/api/)) — create a donation record per order, tag it with the customer-selected nonprofit, Change invoices monthly.

**Fees — three tiers (verified, [getchange.io/pricing/companies](https://getchange.io/pricing/companies)):**

| Plan | Monthly fee | Per-transaction fee | Nonprofits/year | Notes |
|---|---|---|---|---|
| **Starter** | $0 | **2.9%** | up to 5 | CSV upload or API, nonprofit verification checks included |
| **Plus** | $999 | 2.49% | up to 1,000 | Robust nonprofit APIs, dedicated dev support, reconciliation exports |
| **Enterprise** | Custom | Flexible | Unlimited | Nationwide legal compliance, state campaign reporting, custom payout flows |

At ToonTails' current scale (3 named TX rescues + a "let us choose" router — 3 distinct orgs, well under Starter's 5-nonprofit cap), **Starter is the right tier and is dramatically cheaper than Pledge's API** — flat 2.9%, no $5/month disbursement fee, no separate card-processing pass-through (Change isn't touching card rails; it invoices us and we pay by ACH/card on our own terms).

**Small/local TX rescues not in the database:** Change supports **nonprofit-request submission via API** — org name, EIN, address, mission, etc. — which returns a `pending` status and a `nonprofit_id` once accepted (per Change's API docs). Same mechanic as Pledge; requires the rescue to have a real EIN and 501(c)(3) determination.

**Commercial-co-venturer compliance (this is Change's real differentiator for ToonTails):** Change has a **dedicated CCV product** ([Commercial Co-Venturers solution](https://getchange.io/solutions/commercial-co-venturers)) that:
- Provides **a single CCV agreement**, executed in partnership with Our Change Foundation, covering all 8 states with CCV-specific rules — "eliminating the need for costly legal counsel."
- Runs a **consolidated onboarding questionnaire** instead of 8 separate state forms.
- Manages **20+ state filings**, including the two states that require surety bonds (Massachusetts, Alabama — matches the bond states flagged in `economics-and-structure.md` §2.3).
- Claims a **5-week timeline** to full 8-state compliance.
- **This appears to be an add-on, not bundled free into Starter** — the pricing page lists "Commercial co-venture agreement & filings" under the Compliance & Regulatory Filings comparison and directs to "Contact Us" for pricing; it is *not* one of Starter's four bullet features. Budget for this as a paid add-on once ToonTails advertises nationally (i.e., Phase 1.5 in the economics doc), not needed at TX-only launch volume.

**Public verification artifact:** Donation payouts to nonprofits go out **via ACH within 3–7 days** of Change receiving payment on our invoice; companies get a **single consolidated year-end tax receipt** via Our Change Foundation. Like Pledge, this is not an autonomously public ledger — the "outside proof" is the receipt/transaction ID from an independent DAF, which ToonTails can publish on `/impact`, plus the fact the rescue's own bank deposit will show the sender as "Our Change Foundation" / Change, not ToonTails LLC.

**Trust signal:** Change is SOC 2 Type II certified ([announcement](https://getchange.io/blog/change-achieves-soc-2-type-ii-certification-strengthening-data-security)) and used by Lyft, Brex, and others per its customer logos.

---

### 1.3 Percent (poweredbypercent.com) — ruled out

`poweredbypercent.com` now **redirects to goodstack.io** — Percent rebranded/merged into **Goodstack**. Goodstack today is positioned for **enterprise employee-giving, education/nonprofit *verification*, and grants management** (customers: Google, LinkedIn, Atlassian, Asana, monday.com), not a lightweight checkout-donation API for a $100–2,000/month e-commerce pledge program. No self-serve pricing is published; the flow is "Request a Demo" enterprise sales. **Not a fit for ToonTails' current shape** — flag as ruled out, not researched further.

### 1.4 Givebutter — interim/manual option, not the primary API

**What it is:** A free-to-use fundraising platform (campaign pages, not a checkout-embed API in the same sense as Pledge/Change). Fee model ([givebutter.com/pricing](https://givebutter.com/pricing)): **$0 platform fee** when optional donor tipping is enabled (donors cover processing voluntarily, and Givebutter backstops any gap so the nonprofit gets 100%); if tips are disabled, a flat **3% platform fee** + standard card/ACH processing applies. Has a **public API** for custom integrations.

**Why not primary:** Givebutter's product shape is "run a fundraising campaign," not "auto-donate $1 per e-commerce transaction with programmatic charity designation." It's the wrong tool for per-order automation.

**Why it's still useful:** As an **interim, zero-cost stopgap** — before the Change API is wired into checkout, ToonTails could run one Givebutter campaign per rescue, manually total up pledges monthly from Stripe order data, and push one lump-sum donation through Givebutter. That gives an outside-processed receipt and a public campaign page **without waiting on an API integration**. Not recommended as the long-term answer since it re-introduces a manual reconciliation step (an internal control weakness a skeptic could poke at), but useful for month one.

### 1.5 Daffy, Benevity — ruled out for our shape

- **Benevity**: workplace-giving/CSR platform. Pricing is tiered by *employee count*; SMB plans still run ~$190+/mo and mid-size employee-giving modules run **$20,000–$50,000/year** ([Vendr/Spendhound pricing aggregation](https://www.spendhound.com/marketplace/benevity-pricing)). Built for companies giving on behalf of *employees*, not consumers at checkout. Wrong shape and priced for a company far larger than ToonTails.
- **Daffy for Business**: as of April 2026 Daffy added **employer stock-matching** for workplace giving ([BusinessWire](https://www.businesswire.com/news/home/20260401763376/en/Daffy-Becomes-the-First-Giving-Platform-to-Support-Employer-Matching-with-Public-or-Private-Stock)) — again a workplace/employer-match product, not a per-transaction consumer checkout donation API with a charity picker. Ruled out.

---

## 2. Trust marks / audit routes (secondary layer)

### 2.1 Commercial co-venturer (CCV) state filings as public proof

Per `economics-and-structure.md` §2.3, CCV filings are already required in some form in Massachusetts, Alabama, South Carolina, California, Hawaii, Illinois, and Mississippi if ToonTails advertises the pledge into those states. The filed **written contract with each rescue** and (where required) the **state registration record** are themselves public documents — a customer or journalist could, in principle, pull ToonTails' CCV filing from the MA Attorney General's charities database once registered. This is real outside proof, but it's slow, state-by-state, and doesn't produce a live number — it's a compliance backstop, not the `/impact` page's data source.

### 2.2 CPA "agreed-upon procedures" (AUP) attestation

**What it is:** An attestation engagement where an independent CPA performs specific, pre-agreed procedures (e.g., "trace a sample of X paid orders to the corresponding donation receipts from Change/Pledge and confirm amounts reconcile") and issues a report of findings — **no opinion, just verified facts** ([Illumeo overview](https://www.illumeo.com/all-about-agreed-upon-procedures/), [DWC CPAs explainer](https://dwcadvisors.com/what-is-an-agreed-upon-procedures-aup-engagement-and-does-your-business-need-one/)). AUPs are explicitly positioned as the **cheap, fast alternative to a full review or audit**.

**Cost — estimate, not independently sourced for this exact scope:** general small-business/small-nonprofit AUP engagements (single narrow scope, low transaction volume) typically run **roughly $1,500–$5,000**, well below a compilation/review (~$3,000–$8,000) or a full audit (~$8,000–$20,000+) for an entity this size. No provider published a fixed price for this specific scope; get a quote from a local TX CPA before committing this number anywhere public.

**When it's worth it:** Not at launch. Worth revisiting once monthly pledge volume is large enough (~$2,000+/mo, i.e., the top end of the near-term range) that an annual "independently verified: $X paid to rescues in 2027" one-pager becomes a credible marketing asset — think a one-page PDF linked from `/impact`, refreshed yearly.

### 2.3 GuideStar / Candid Seal of Transparency — clarify what we can and can't display

The **Candid Seal of Transparency (Bronze/Silver/Gold/Platinum)** is **exclusively for nonprofit organizations** — "not available to for-profits or other types of organizations" ([Candid's own explainer](https://candid.org/blogs/what-is-a-seal-of-transparency-your-questions-about-candid-seals-answered/)). **ToonTails, as an LLC, cannot earn or display a Candid Seal itself.** What we *can* legitimately do:
- Verify (and say we verified) that each recipient rescue holds a **Candid/GuideStar profile and, ideally, a Seal of Transparency** — this becomes part of our own rescue-vetting checklist (alongside IRS Pub 78 and OFAC screening, per `economics-and-structure.md` §2.6).
- Link out to each rescue's own Candid profile from `/impact` as evidence that *they* are legitimate — that's honest and useful. Claiming any transparency seal for ToonTails itself would be false and is exactly the kind of claim that gets attention from the FTC or a state AG (see `economics-and-structure.md`'s EarthRite citation).

### 2.4 B Corp — one line

Too heavy for now: minimum **~$2,100/year** certification fee for revenue under $5M, plus a **6–8 month** part-time effort to complete the B Impact Assessment, and (new for the 2026 v2 standard) a pass-through third-party audit fee ([Beancount 2026 cost-benefit guide](https://beancount.io/blog/2026/07/19/is-b-corp-certification-worth-it-small-business-guide)). Revisit at real scale (Phase 2 territory), not before.

---

## 3. What `/impact` should show, and the exact copy

### 3.1 What changes once the API is wired in

- **Live donation feed**: pull from Change's transaction/webhook data (or Pledge's Impact Hub export) instead of the hardcoded arrays in `src/lib/impact.ts` — same UI, real data source.
- **Per-customer receipt link**: each order's confirmation email/page gets the donation's transaction ID from Change, so a customer can independently ask the rescue "did you get a $1 donation with reference #X" if they're skeptical.
- **Monthly total + statement link**: a rolled-up "$X to rescues this month" stat with a link to a reconciliation export (Change's Plus-tier export, or a manually-assembled statement at Starter tier) — the artifact a journalist or a picky customer (like Chad) would actually want to click.

### 3.2 Interim copy — BEFORE integration (use now)

The current page's "Sample data" framing is directionally correct — keep the honesty, tighten the promise:

> **Badge:** Pre-launch — figures are illustrative
>
> **Headline:** A public, running ledger
>
> **Body:** Every ToonTails episode you buy pledges real money to dog rescues. We haven't sold our first episode yet, so the numbers below are placeholders, not live data — we built the page first so you'd know exactly what to expect. Once we launch, this page updates from records generated by an independent donation platform, not by us — so you'll never have to take our word for it.

> **Ledger table caption (small print under "How the money moves"):** These per-order amounts ($1.00 / $2.50 / $5.00) are the pledge amounts we plan to honor at launch. They are not yet backed by a live transaction — check back after our first sale.

Keep the "Sample receipt" and "Sample data" labels on the individual UI elements exactly as they are today (`src/app/impact/page.tsx`) — they're doing their job.

### 3.3 Post-integration copy — AFTER Change (or chosen platform) goes live

> **Badge:** Live — every payout independently processed
>
> **Headline:** A public, running ledger
>
> **Body:** Every ToonTails episode you buy pledges money to dog rescues. Donations are processed and disbursed by [Change](https://getchange.io), an independent donation-compliance platform, in partnership with Our Change Foundation, a registered donor-advised fund. Change — not ToonTails — sends the money and issues the receipt. See how it works →

> **"How the money moves" section, added paragraph:** We fund every pledge through Change, a third party that verifies each rescue against IRS records before releasing a dollar and pays out by ACH within days. ToonTails never holds or moves rescue funds directly. Every order gets a receipt reference you can use to confirm the donation independently — [here's an example →]

> **Per-order receipt copy (replaces "Sample impact receipt"):** Your episode of **{dog}** triggered a **${amount}** donation to **{rescue}**, sent via Change on {date}. Reference #{change_transaction_id}. [View how Change verifies nonprofits →](https://getchange.io/product/nonprofit-verifications)

Do **not** claim a "public record" hosted by Change itself — Change's model is invoice-and-disburse, not a public blockchain-style ledger. The "outside proof" is (a) the independent sender name on the rescue's own deposit, (b) the transaction reference we publish per order, and (c) — once volume justifies it — the annual CPA AUP letter (§2.2). Word the page to reflect exactly that, nothing more.

---

## 4. Recommendation

### 4.1 Platform: Change (getchange.io), Starter plan

**Why Change over Pledge, at ToonTails' shape:**

| Factor | Change (Starter) | Pledge (Donate API) |
|---|---|---|
| Monthly fee | $0 | $0 |
| Per-transaction cost | 2.9% flat | 5% + 2.9%+$0.30 processing + $5/mo disbursement |
| Nonprofit cap | 5/year (fits our 3 rescues) | Unlimited (2M+ database) |
| CCV compliance | Dedicated product, single agreement, 8-state coverage — paid add-on | Claims broad state coverage, less CCV-specific tooling |
| Fit for "customer picks charity at checkout" | Purpose-built for this (Donations at Checkout use case) | Supported, more general-purpose |
| New/small nonprofit onboarding | API request flow, EIN required | Form + manual review, 1–2 business days |

Change is materially cheaper at our volumes (see fee table below) and its product is explicitly built for the exact scenario ToonTails has — a for-profit pledging a flat per-unit amount to a customer-chosen charity at checkout, with CCV exposure to manage. Pledge is a fine second choice (bigger brand roster, larger charity database) if Change's onboarding or nonprofit-cap turns out to be a blocker in practice.

### 4.2 Fee estimate at $100 / $500 / $2,000 monthly pledge volume

*(These are the pledge-dollar totals — i.e., $1/$2.50/$5 per order, added up — not gross revenue.)*

| Monthly pledge volume | Change (Starter, 2.9%) | Pledge (Donate API, ~5% + processing + $5/mo) |
|---|---|---|
| $100 | **$2.90** (2.9%) | **$13.20** (13.2%) |
| $500 | **$14.50** (2.9%) | **$44.80** (9.0%) |
| $2,000 | **$58.00** (2.9%) | **$163.30** (8.2%) |

**Recommendation: ToonTails absorbs this fee itself rather than shorting the rescue.** At these dollar amounts (a few cents to ~$58/month) it's trivial against the contribution margins modeled in `economics-and-structure.md` (§1.5–4.2: $1.65–$8.11 net contribution per order). Absorbing the fee means the literal claim "$1.00 of every episode goes to the rescue you choose" stays **100% true**, satisfying the BBB Standard 19 / NY AG flat-dollar-amount requirement cited in the economics doc — instead of quietly netting the rescue $0.971 and needing an asterisk.

### 4.3 Signup / integration checklist

**What Chad must do (cannot be automated):**
1. Decide LLC entity name/EIN that will sign up with Change (per `economics-and-structure.md` §2.3 — PupTV LLC or a Dominium Group dba) before requesting a Change account, since Change invoices the legal entity monthly.
2. Confirm the three named rescues (Second Chance Ranch Rescue, Lone Star Bully Rescue, Paws & Hearts Sanctuary) actually hold current 501(c)(3) determinations and EINs — needed for both the Change/Pledge nonprofit-request flow and the IRS Pub 78 vetting step already planned in the economics doc. Pull each org's EIN before requesting a Change/Pledge account.
3. Request a Change demo/account ([getchange.io/request-a-demo](https://getchange.io/request-a-demo)) and get written confirmation of the Starter plan's actual terms (published self-serve pricing on B2B donation platforms sometimes requires a sales conversation to activate) — confirm no minimum commitment before signing.
4. Sign the CCV agreement Change offers once advertising expands beyond TX (Phase 1.5 in the economics doc) — this is a real signature/contract step, not code.
5. Decide whether ToonTails absorbs the 2.9% fee (recommended, §4.2) or discloses it — this is a policy call, not a technical one.

**What can be coded (engineering, not Chad):**
1. Stripe checkout webhook → on successful payment, call Change's Donations API to create the pledge donation, tagged with the customer's selected rescue's `nonprofit_id`.
2. Store the returned transaction/receipt reference against the order record.
3. Replace the hardcoded arrays in `src/lib/impact.ts` with a query against real order + donation-transaction data; keep the same UI shell in `src/app/impact/page.tsx`.
4. Swap the `/impact` copy from §3.2 (interim) to §3.3 (post-integration) the day the first live donation clears.
5. Build the nonprofit-request flow (or do it once, manually, for the 3 known rescues) so future rescues can be onboarded without a code change.

### 4.4 Interaction with CCV disclosure obligations

From `economics-and-structure.md` §2.3: ToonTails is a **commercial co-venturer** the moment it advertises "$1 of every episode goes to the rescue you choose." That obligation exists **regardless of which donation platform is used** — routing money through Change or Pledge does not make ToonTails stop being the party making the public charitable-sales-promotion claim; it only affects *how cleanly* the money-movement side of that promise can be proven and (via Change's bundled CCV agreement) how easily the state paperwork gets done. Two things follow directly:
1. **The flat per-unit disclosure rule** (BBB Standard 19 / NY AG best practices, already flagged in the economics doc) is satisfied more easily once a third party is issuing receipts for exactly $1.00/$2.50/$5.00 — Change's transaction record becomes the evidence that the "flat dollar amount" claim was literally honored.
2. **CCV state registration** (Massachusetts $25k bond, Alabama $10k bond, plus contract-filing-only states) is a separate legal step from the donation-processing choice — Change's CCV product can shorten that path once ToonTails advertises nationally, but it is not a substitute for it, and it is not needed at TX-only launch volume per the economics doc's own phased plan.

---

## Sources

- [Pledge (pledge.to) — Pricing](https://www.pledge.to/pricing)
- [Pledge — Donate API fee breakdown](https://help.pledgeling.com/support/solutions/articles/36000233798-what-are-the-fees-for-donations-made-via-the-api-)
- [Pledge — Embedded Giving / APIs product](https://www.pledge.to/products/apis)
- [Pledge — Compliance solution](https://www.pledge.to/solutions/compliance)
- [Pledge — How to get a nonprofit added to the database](https://help.pledgeling.com/support/solutions/articles/36000036104-how-to-get-a-nonprofit-added-to-our-database)
- [Change (getchange.io) — Pricing for Companies](https://getchange.io/pricing/companies)
- [Change — Commercial Co-Venturers solution](https://getchange.io/solutions/commercial-co-venturers)
- [Change — Donations API docs](https://docs.getchange.io/api/)
- [Change — FAQ for businesses](https://getchange.io/faq/business)
- [Change — SOC 2 Type II announcement](https://getchange.io/blog/change-achieves-soc-2-type-ii-certification-strengthening-data-security)
- [Goodstack (formerly Percent / poweredbypercent.com)](https://goodstack.io/)
- [Givebutter — Pricing](https://givebutter.com/pricing)
- [Benevity pricing aggregation — Spendhound](https://www.spendhound.com/marketplace/benevity-pricing)
- [Daffy for Business — employer stock matching, April 2026](https://www.businesswire.com/news/home/20260401763376/en/Daffy-Becomes-the-First-Giving-Platform-to-Support-Employer-Matching-with-Public-or-Private-Stock)
- [Illumeo — All About Agreed-Upon Procedures](https://www.illumeo.com/all-about-agreed-upon-procedures/)
- [DWC CPAs — What is an AUP engagement](https://dwcadvisors.com/what-is-an-agreed-upon-procedures-aup-engagement-and-does-your-business-need-one/)
- [Candid — What is a Seal of Transparency](https://candid.org/blogs/what-is-a-seal-of-transparency-your-questions-about-candid-seals-answered/)
- [Beancount — B Corp certification cost/benefit, 2026](https://beancount.io/blog/2026/07/19/is-b-corp-certification-worth-it-small-business-guide)
- `docs/economics-and-structure.md` (this repo) — CCV state requirements, disclosure rules, phased structure plan
- `docs/charity-structure.md` (this repo) — entity-structure options background
