# Auth setup — turning on Google sign-in

PupTV's sign-in is Google-only, env-gated, and database-free (JWT session
cookie, no adapter — see `src/lib/auth.ts`). With none of the three env
vars below set, the app is exactly what it is today: no "Sign in" button
anywhere, and `/account` shows a "coming soon" explainer. Set all three
and it turns on — no code change, no redeploy needed beyond the env
var update itself.

## 1. Create the Google Cloud project

1. Go to https://console.cloud.google.com/projectcreate
2. Name it (e.g. "PupTV") and click **Create**.
3. Make sure the new project is selected in the top project switcher.

## 2. Configure the OAuth consent screen

1. Left nav → **APIs & Services** → **OAuth consent screen**.
2. User type: **External** → **Create**.
3. App name: `PupTV`. User support email: your email. Developer contact
   email: your email. Leave everything else default → **Save and Continue**
   through Scopes (skip — we don't add any here) and Test users (skip)
   → **Back to Dashboard**.
4. This app only ever requests `openid`, `email`, `profile` — Google's
   default, non-sensitive scopes — so it does **not** need Google's
   restricted-scope verification. That review only becomes required
   later, when `youtube.upload` is added (see `docs/youtube-verification.md`).

## 3. Create the OAuth client (web application)

1. Left nav → **APIs & Services** → **Credentials**.
2. **+ Create Credentials** → **OAuth client ID**.
3. Application type: **Web application**. Name: `PupTV web`.
4. **Authorized JavaScript origins** — add both:
   - `https://puptv.vercel.app`
   - `http://localhost:3000`
5. **Authorized redirect URIs** — add both:
   - `https://puptv.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google`
6. **Create**. Copy the **Client ID** and **Client secret** shown in the
   dialog — the secret is only ever shown once (you can always view/reset
   the ID and regenerate the secret later from the Credentials page).

## 4. Generate the session secret

Run locally:

```bash
openssl rand -base64 33
```

This is `AUTH_SECRET` — it signs the session JWT cookie. It has nothing
to do with Google; generate it once and keep it stable (rotating it signs
everyone out).

## 5. Set the environment variables

**Local (`.env.local`, copy from `.env.local.example`):**

```
AUTH_SECRET=<output of openssl rand -base64 33>
GOOGLE_CLIENT_ID=<client id from step 3>
GOOGLE_CLIENT_SECRET=<client secret from step 3>
```

**Vercel (production):** Project → **Settings** → **Environment
Variables** → add all three as above, scoped to **Production** (and
Preview, if you want sign-in on preview deploys too) → **Save**. Vercel
already sets `VERCEL=1`, which `src/lib/auth.ts` treats as an implicit
`AUTH_TRUST_HOST=true`, so nothing else is needed for Vercel specifically.

Redeploy (or just wait for the next deploy) and the "Sign in" button
appears in the nav, `/create`'s confirmation step offers Google sign-in,
and `/account` shows real session details instead of the coming-soon copy.

## 6. Later: enabling YouTube auto-publish

This same OAuth client is reused when `youtube.upload` is added — see the
one-line change called out in `src/lib/auth.ts` (the `scope` comment
inside `buildProviders()`). That scope is a Google **restricted scope**
and requires OAuth verification + an annual security assessment before
production (public) uploads work. Full timeline, quota numbers, and the
step-by-step submission checklist are in `docs/youtube-verification.md`.
Start that process early — it runs 6–12+ weeks end to end and can proceed
in parallel with everything else.
