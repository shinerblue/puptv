# YouTube Data API Verification & Quota Guide

## Summary: Recent Changes (December 2025)

As of **December 4, 2025**, Google reduced the quota cost of `videos.insert` from ~1,600 units per call to ~100 units per call. This change means:
- **Before:** ~6 uploads/day on free tier (10,000 ÷ 1,600)
- **After:** 100 uploads/day on free tier (10,000 ÷ 100)

As of **June 2026**, `videos.insert` has its own dedicated daily bucket separate from the general quota pool, with a default allocation of 100 calls/day.

**Source:** [YouTube API Quota Limits 2026](https://www.getphyllo.com/post/youtube-api-limits-how-to-calculate-api-usage-cost-and-fix-exceeded-api-quota)

---

## Restricted Scope: youtube.upload

The `youtube.upload` scope is classified as a **restricted scope** because it permits public video uploads to YouTube.

### What Unverified Apps Can't Do

- **Public uploads blocked:** Unverified apps can only upload videos in **Private** status; YouTube automatically locks them and users cannot make them public.
- **Testing limit:** Unverified apps are limited to 100 test users.
- **No production access:** If you need to deliver public videos to end-user YouTube channels, you must complete verification.

**Source:** [Restricted scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification)

---

## Verification Timeline

The restricted scopes verification process has **three phases**:

### 1. Brand Verification (2–3 business days)
- Required first, if branding has changed since last approval
- Establishes your organization's identity in Google's system

### 2. OAuth Consent Screen Review (2–8 weeks)
- Automatic review queue; timeline varies based on submission backlog and remediation rounds
- Google evaluates your use case, privacy policy, and data handling

### 3. Security Assessment (Required, adds 4–12 weeks)
- If your app accesses or can access Google user data from a **server**, you must undergo an annual security assessment
- Assessor must be approved by Google (third-party, independent)
- This is the longest phase and should be factored into your launch plan

**Total estimated timeline:** 6–12+ weeks from initial submission to production approval

**Source:** [Restricted scope verification | Google for Developers](https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification), [Google OAuth Verification Guide (2026)](https://singhamandeep.com/google-oauth-verification-guide/)

---

## API Quota Breakdown for PupTV

### Daily Quota Allocation (as of June 2026)

| Method | Daily Limit | Cost | Purpose |
|--------|------------|------|---------|
| `videos.insert` | 100 calls/day | 100 units per call | Upload video file |
| `search.list` | 100 calls/day | 100 units per call | Query for playlists |
| Other methods | 10,000 units/day | Varies | All other API calls |

**Key:** The 10,000-unit general pool does NOT include `videos.insert` or `search.list`—they have separate dedicated buckets.

### Example: Business with 10 Uploads/Day
- Daily cost: 10 uploads × 100 units = **1,000 units**
- Daily cost (other methods): ~200 units (for metadata, playlist ops)
- **Total:** ~1,200 units/day (well under 10,000 free tier)
- **Monthly:** ~36,000 units (under free tier, no cost)

### Example: Business with 50 Uploads/Day
- Would exceed the 100 videos.insert daily limit
- Must request quota increase from Google (see below)

**Source:** [YouTube API Quota Limits 2026: 10,000 Units, Costs & How to Get More](https://www.getphyllo.com/post/youtube-api-limits-how-to-calculate-api-usage-cost-and-fix-exceeded-api-quota)

---

## Quota Increase Request

If you need more than 100 uploads/day:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project → **APIs & Services** → **YouTube Data API v3**
3. Click **Quotas** tab
4. Find `youtube.upload` (or `videos.insert`)
5. Click the pencil icon → request increase
6. Specify your desired daily limit and use case
7. Submit; Google reviews within 2–5 business days

**Important:** You must be approved for restricted scope verification before quotas will be increased.

**Source:** [YouTube API Pricing: Complete Guide for 2026](https://www.blotato.com/blog/youtube-api-pricing)

---

## Step-by-Step: Start This Week

### Phase 1: Setup (Week 1)

- [ ] Create Google Cloud project (or use existing)
- [ ] Enable YouTube Data API v3 in Cloud Console
- [ ] Create OAuth 2.0 credentials (choose app type: Web, Desktop, or Installed)
- [ ] Add redirect URIs (e.g., `http://localhost:3000/oauth/callback`)
- [ ] Save Client ID and Client Secret securely

### Phase 2: Test Integration (Week 1–2)

- [ ] Implement OAuth 2.0 flow using a client library ([google-auth-library-python](https://github.com/googleapis/google-auth-library-python), [google-auth-library-nodejs](https://github.com/googleapis/google-auth-library-nodejs), etc.)
- [ ] Test `videos.insert` with a **Private** video upload (no verification required yet)
- [ ] Test with multiple test user accounts (up to 100 users in test mode)
- [ ] Verify quota tracking in Cloud Console → Quotas dashboard

### Phase 3: Restricted Scope Verification Submission (Week 2–3)

- [ ] Create OAuth consent screen in Google Cloud Console
  - Add app name, logo, privacy policy URL, terms of service URL
  - Specify scopes: `youtube.upload` and any others needed (e.g., `userinfo.profile`)
- [ ] Record a **demo video** (2–5 minutes) showing:
  - How the user launches your app
  - How the user grants the `youtube.upload` scope
  - The confirmation dialog they see
- [ ] Upload demo video to YouTube (unlisted), get link
- [ ] Fill out [OAuth Verification Form](https://support.google.com/cloud/answer/7454865)
  - Provide app name, developer account, demo video link
  - Describe your use case (e.g., "Auto-publish personalized dog videos to users' channels")
  - Link privacy policy and terms of service
- [ ] Submit for review

### Phase 4: Security Assessment (Week 4–8, runs parallel)

- [ ] Identify a [Google-approved security assessor](https://support.google.com/cloud/answer/7454865) 
- [ ] Book assessment (can take 2–4 weeks to schedule)
- [ ] Complete assessment with assessor
- [ ] Provide assessment report to Google in Cloud Console

### Phase 5: Monitor & Respond (Week 2–12)

- [ ] Check Google Cloud Console notifications daily
- [ ] If Google requests remediation (privacy policy changes, demo re-record, etc.), respond within 5 business days
- [ ] Once approved, your app can upload **public** videos to user channels

---

## What to Prepare Before Submitting

### Required Documents

1. **Privacy Policy** (public URL)
   - Explain data you collect, how you use it, retention
   - Must comply with GDPR, CCPA, etc.

2. **Terms of Service** (public URL)
   - Clarify user rights, liability, use restrictions

3. **Demo Video** (unlisted YouTube link)
   - Show user opt-in flow, scope request, and confirmation

4. **Use Case Description**
   - Explain why you need `youtube.upload`
   - Describe how users benefit
   - Example: "PupTV generates personalized AI videos of users' dogs and auto-publishes them to the user's YouTube channel, with proceeds donated to dog rescues."

### Common Rejection Reasons

- Privacy policy missing or too vague
- Demo video doesn't clearly show user consent
- App description doesn't match actual use case
- No terms of service
- Use case sounds like scraping or unauthorized automation

---

## Monitoring Quota Usage

In **Google Cloud Console → APIs & Services → Quotas**:

- Filter by YouTube Data API v3
- View daily usage for each method
- Set up alerts (e.g., notify when usage exceeds 80% of daily limit)
- Export usage reports (CSV) for cost tracking

**Source:** [YouTube API Quota Explained: Limits, Costs per Call & How to Fix quotaExceeded (2026)](https://outlierkit.com/resources/youtube-api-quota/)

---

## Resources

- [YouTube Data API Guides (Official)](https://developers.google.com/youtube/v3/guides)
- [OAuth 2.0 Scopes Reference](https://developers.google.com/identity/protocols/oauth2/scopes#youtube)
- [Google Cloud OAuth Verification](https://support.google.com/cloud/answer/7454865)
- [Upload & Schedule YouTube Videos via API (2026 Guide)](https://posteverywhere.ai/blog/post-to-youtube-api)
