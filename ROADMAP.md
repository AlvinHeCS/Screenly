# Screenly — Loom Clone Roadmap

> Async screen-recording + video messaging. Record screen (+ webcam + mic) → upload → process → share a link → viewers watch, react, comment.
>
> **Stack (from Anthony's Lyroom + confirmations):** T3 Turbo monorepo · Electron desktop capture · Next.js 15 web · tRPC v11 · Prisma/Postgres (Neon) · **Cloudflare Stream** (upload/transcode/HLS/player) · **Inngest** (async workflows) · Auth.js v5 · Resend · Stripe · Vercel.
>
> Current repo = bare `create-t3-app` scaffold (only the default `Post` model). This is greenfield.

---

## The core loop & MVP definition

**The single slice to build first:** a signed-in user opens the web app, clicks record, captures screen + mic via the **browser** (`getDisplayMedia`/`getUserMedia` + `MediaRecorder`), bytes upload **directly to Cloudflare Stream** via a one-time resumable (tus) URL — never through Vercel — a Stream webhook fires an Inngest function that flips the `Video` row to `READY`, and the user gets an unguessable `/v/{slug}` link that plays back the adaptive-HLS video with a view count and flat comments.

This proves **record → upload → process → share → play** before spending a day on Electron signing, system audio, or SSO. The browser path also stays forever as the zero-install fallback.

**Deliberately excluded from MVP (and why):**
- **Electron desktop app** — eventual *primary* client, but code-signing/notarization/auto-update is the classic schedule-killer. First big V1 epic.
- **System/desktop audio** — needs the native client (ScreenCaptureKit / WASAPI). Mic-only at MVP — and on Safari/Firefox mic-only is often the *only* thing that works anyway.
- **Signed/private playback** — MVP is public-by-unguessable-slug (`requireSignedURLs=false`). Password/workspace-only/signed-token privacy is V1.
- **AI transcription, trimming, reactions, teams, Stripe.** MVP = "everyone is Free, one hard cap."

**MVP scope discipline (corrections from review — these keep Phase 0 to ~days, not weeks):**
- **Auth = Google OAuth only.** Defer magic-link → V1 (avoids Resend/DKIM/deliverability side-quest before you've recorded anything).
- **Keep the `Workspace`/`Membership`/`Role` columns, but defer role *enforcement*.** MVP just auto-provisions a personal workspace per user and checks `ownerId`. The role matrix does nothing until invites exist (V1).
- **Add to MVP (the synthesis missed these):** a **"My Videos" dashboard/library** (list, rename, re-copy link, delete), a **`video.delete` that also deletes the Stream asset** (or your Cloudflare bill grows forever during testing), the **processing-state viewer UI as critical-path** (it's the most-hit state in the first demo), a **permission-denied / no-screen-selected recovery UI**, and **lightweight Sentry** on the recorder (capture pipeline failures are exactly what you can't reproduce locally).

---

## Phased feature map

### Phase 0 — MVP
*Goal: thinnest end-to-end loop on a real multi-tenant foundation.*

- **Infra:** Convert scaffold → **Turborepo** (`apps/web`, `packages/{api,db,auth,validators,ui}`), npm→**pnpm**, move Prisma generated client out of `./generated/prisma` into `packages/db`. Vercel + preview envs + **pooled Neon** (`pgbouncer=true`, `connection_limit=1`). Typed env (`t3-env`) extended for Stream/Inngest/auth secrets.
- **Data model:** Replace `Post` with `User/Account/Session` (Auth.js), `Workspace` + `Membership`, `Video` (status enum, `cloudflareUid`, `slug`, `ownerId`, `workspaceId`), `View`, `Comment`. Every owned row carries indexed `workspaceId`.
- **Auth:** Auth.js v5 **Google OAuth** + Prisma adapter; auto-provision personal workspace on signup; `protectedProcedure` (`workspaceProcedure` lands with V1 roles).
- **Capture (browser):** `getDisplayMedia` + `getUserMedia` (device picker, live preview) → `MediaRecorder` (codec feature-detect: Chrome vp9/webm, Safari h264/mp4). 3-2-1 countdown, floating stop/timer bar, **aggressive server-driven cap (~5–10 min)**, and **stream `MediaRecorder` chunks into the tus upload as they arrive** (don't buffer a 1GB blob in a tab — that's what OOMs the demo).
- **Pipeline:** `video.createUpload` mints a one-time Stream **direct-creator tus URL** (token stays server-side), creates `Video` in `UPLOADING`. Stream transcodes → HLS + thumbnail (set `thumbnailTimestampPct` so you don't ship black tiles). **Stream webhook → Next route (HMAC-verify) → Inngest** flips status, persists duration/dims/thumbnail. **Reconciliation cron** for missed webhooks (with max-attempts + age-out → terminal `ERRORED`).
- **Share & playback:** `cuid2` slug, link copyable instantly (playback lands 20–90s later — processing-state UI handles the gap). `/v/{slug}` Server Component renders **Stream stock player**, autoplay-muted + unmute, OG tags.
- **Library & lifecycle:** `/dashboard` list of my videos (rename, re-copy, **delete → also deletes Stream asset**).
- **Engagement:** flat comments, debounced view-count, owner stats card. Lightweight **Sentry** on recorder + API.

### Phase 1 — V1
*Goal: a credible product people adopt. **Split to de-risk Electron:***

**V1a — browser-path, no native dependency (ship first):**
- **AI & transcription (the keystone differentiator):** Inngest pipeline off the Stream `ready` webhook → **dedicated ASR (Deepgram/AssemblyAI/Whisper-large)** with **word-level timestamps** stored in Postgres (Stream's free captions are English-only, no word timestamps — a dead end). Derived VTT → Stream captions. Auto title/summary/chapters (LLM). Interactive transcript panel + transcript search (Postgres `tsvector`/GIN). *Reads the Stream download URL — does not need the desktop app, so don't let cert procurement gate it.*
- **Custom player (substrate for every overlay):** branded React player over **hls.js**, speed control, captions toggle, responsive/mobile (`playsInline`, iOS quirks).
- **Engagement:** **timestamped comments** (scrubber markers + seek), threaded replies, emoji reactions, @mentions, view notifications, watch-time/completion graph + drop-off heatmap.
- **Real privacy:** flip on Stream **`requireSignedURLs` + JWT signed tokens** minted in tRPC; password, **workspace-only**, disable-download/comments. One shared `canAccess(video, actor, action)` policy used by both resolvers and the token minter (no IDOR gap).
- **Magic-link auth**, team workspaces + **invites** (Resend), roles enforced in `workspaceProcedure`, **Stripe** subscriptions + paywalls + storage-quota (minutes) + **Cloudflare Stream cost guardrails** (cap stored *and* delivered minutes). **Folders/Spaces.** Basic **`/embed/{slug}`** (cheap on the Stream player — drives the viral loop early). CI + testing + audit logs.

**V1b — Electron desktop (the headline epic; reserve calendar time):**
- `apps/desktop` (electron-vite, contextIsolation, secure preload) reusing shared tRPC + upload code; `desktopCapturer`, always-on-top camera bubble.
- **Code-signing + Apple notarization + Windows Authenticode** + `electron-updater` (budget *days* for EV cert procurement + a macOS CI runner).
- **Desktop↔web auth:** **loopback `http://127.0.0.1:<port>` as the primary** OAuth path (what gh CLI / AWS SSO use), `screenly://` custom-scheme as the fragile fallback. PKCE → token in OS keychain (`safeStorage`). Auth.js (sessions in our Postgres, reusable by desktop) over Clerk for exactly this reason.
- **System/desktop audio** (ScreenCaptureKit / WASAPI loopback), permission/setup wizard (macOS TCC), capture modes, resolution/FPS (plan-gated), pause/resume.

### Phase 2 — V2
*Goal: team/growth/virality + retention.*
- **Capture/editing:** local-first crash-recovery vault, background queue/offline, draw/annotate, background blur (MediaPipe), browser-extension capture (MV3), R2 raw-recording backstop, **trim/clipping** (Stream clip API → non-destructive child videos).
- **AI:** "Ask this video" RAG (pgvector, permission-scoped), speaker diarization, action-item extraction, **filler-word/silence removal** (non-destructive EDL first — Stream has *no* server-side cut; ffmpeg render farm is a late-V2/V3 build), translation/subtitles.
- **Engagement/sharing:** chapters UI, CTAs + end screens, recorded video reactions, link expiry, per-recipient tracked links, email-gate viewer identity, **workspace analytics dashboard** (pre-aggregated), CSV export.
- **Integrations (virality):** unified OAuth framework + outgoing webhooks + **public REST/tRPC API** (`trpc-openapi`); **Slack** (share/unfurl/notify), Gmail/Outlook insert, Notion/Jira/Linear embeds, **Zapier**.
- **Billing/security:** seat billing, metered AI minutes (Stripe Billing Meters), dunning, retention/purge, **content moderation + CSAM scanning** (hard requirement the moment untrusted users can upload — could be earlier if you add guest recording).

### Phase 3 — V3
*Goal: scale, enterprise, advanced AI, polish.*
- **Enterprise:** **SSO/SAML + SCIM** (WorkOS or BoxyHQ — don't hand-roll), audit log + session revocation, **SOC2** (Vanta/Drata), tenant-isolation hardening, Stripe Tax, custom contracts.
- **AI:** dubbing (TTS, multi-audio HLS), AI engagement insights (drop-off × transcript), cost guardrails + no-train guarantee.
- **Realtime/analytics:** live reactions/comments/presence + "watching now" (needs a real transport — **Cloudflare Durable Objects / Pusher / Ably**; fights serverless — poll until then), geo/device/referrer breakdown, CRM logging (HubSpot→Salesforce).
- **Platform:** watermark/QoS, custom branded share pages + vanity slugs + custom domains (Cloudflare for SaaS), self-host / BYO-storage (feasible only because the Stream boundary was built as an interface from MVP).

---

## Dependency-ordered build sequence (start here, day one)

1. **Convert to Turborepo + pnpm.** `apps/web`, `packages/{db,api,auth,validators,ui}`; wire `turbo.json` + tsconfig project references.
2. **Extract Prisma into `packages/db`** (move generated-client output off `./generated/prisma`; fix imports). Keep `prisma migrate` (never `db push` in shared/prod).
3. **Replace `Post`** with `User/Account/Session/VerificationToken`, `Workspace`, `Membership`, `Video`, `View`, `Comment`. First real migration.
4. **Auth.js v5 (Google only)** + Prisma adapter; auto-create personal `Workspace` + `Membership` in the `createUser` event.
5. **Rework tRPC context** (session + active workspace) and add `protectedProcedure`. *(Security chokepoint — build before any data procedure. Full `workspaceProcedure` role enforcement waits for V1 invites.)*
6. **Extend `t3-env`** (`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_STREAM_TOKEN`, `STREAM_WEBHOOK_SECRET`, `INNGEST_*`, auth secrets). Deploy `apps/web` to Vercel with **pooled Neon** (`pgbouncer=true`, `connection_limit=1` — Inngest fan-out will exhaust connections otherwise).
7. **Cloudflare Stream boundary module** in `packages/api`: `createDirectUpload()` (tus URL + `Video` in `UPLOADING`), `getVideo()`, `deleteVideo()`, webhook-signature verifier. Keep behind a clean interface (future self-host).
8. **Browser recorder** in `apps/web`: `getDisplayMedia` + `getUserMedia` (picker, preview), `MediaRecorder` codec feature-detect, countdown + floating controls + cap, **permission-denied recovery UI**.
9. **Resumable upload:** `video.createUpload` → `tus-js-client` streams chunks straight to Stream (progress/resume; persist tus URL to survive refresh).
10. **Get one real video into Stream**, *then* wire the **webhook → Inngest → `READY`** path + reconciliation cron against real upload events. *(Reordered from the raw plan: don't wire/verify the webhook before any upload exists — that's how signature bugs slip through.)*
11. **Instant share:** on stop, `video.create` allocates `cuid2` slug, returns `/v/{slug}` synchronously; copy to clipboard.
12. **`/v/{slug}` viewer** (Server Component): slug→`Video`, **processing-state UI**, Stream stock player, autoplay-muted, OG metadata.
13. **`/dashboard` library** (list/rename/re-copy/**delete → deletes Stream asset**) + debounced view-count + owner stats + flat comments. Lightweight Sentry.
14. **First end-to-end smoke test** (Playwright, mocked Stream/Inngest): sign in → record → upload → webhook → `READY` → open link → plays back. **This is "first shareable video plays back."**
15. **CI** (GitHub Actions + Turbo cache + migration-drift) so the foundation stays green before V1.

---

## Architecture & data model

```
screenly/
├─ apps/
│  ├─ web/       Next.js 15 — dashboard, /v/[slug], /embed, /api/{trpc,inngest,stream-webhook,oembed}
│  └─ desktop/   Electron (V1) — main/preload/renderer; reuses packages/{api,ui}
├─ packages/
│  ├─ db/        Prisma schema + generated client + migrations
│  ├─ api/       tRPC routers, procedures, Stream boundary, Inngest functions
│  ├─ auth/      Auth.js config, adapter, desktop token exchange
│  ├─ validators/  shared zod schemas
│  └─ ui/        shared React (player, recorder UI)
└─ turbo.json, pnpm-workspace.yaml
```

**Core models (key fields):** `User`, `Workspace` (type PERSONAL|TEAM, `stripeCustomerId`, `planId`), `Membership` (role OWNER|ADMIN|MEMBER|VIEWER, `@@unique([userId, workspaceId])`), `Video` (`slug @unique`, `cloudflareUid @unique`, `status` UPLOADING|PROCESSING|READY|ERRORED|DELETED, `ownerId`, `workspaceId`, `visibility` LINK|PASSWORD|WORKSPACE|PRIVATE, `passwordHash`, `allowDownload`, `allowComments`, `durationSec`, `thumbnailUrl`), `Transcript`/`TranscriptSegment` (V1, pgvector later), `Comment` (`timestampMs`, `parentId`, guest fields), `View` (`viewerUuid`, `watchedSec`), `Reaction` (V1).

**Source of truth:** Postgres owns ownership/ACL/app-state; **Cloudflare Stream owns the media**; the webhook reconciles the two; `Video.status` is the contract every other domain reads.

**Flow:** auth (cookie / desktop keychain token, same `User` in tRPC ctx) → record (local blob) → `video.createUpload` (entitlement check → Stream `direct_upload` server-side → `Video` UPLOADING + tus URL, client never sees a CF credential) → bytes stream **directly to Stream** (never via Vercel) → Stream transcodes → HLS, POSTs signed webhook → HMAC-verify → Inngest flips `READY` + fans out (ASR, notifications, AI) → viewer opens `/v/{slug}`, server enforces visibility (mints Stream JWT for private modes) → player + beaconed view events → Inngest rollups → owner analytics.

---

## Key risks & decisions

1. **Monorepo conversion blocks everything; the Prisma `./generated/prisma` path is the trap.** Do Turborepo + pnpm + move generated client into `packages/db` as steps 1–2. Don't start the desktop app until this exists.
2. **The Stream upload boundary is the spine, and webhooks lie.** Thin verify→persist→emit route; all work in **idempotent Inngest functions keyed on `videoId+jobType`**; reconciliation cron with terminal-state rules. Never trust one delivery.
3. **Electron signing/notarization/auto-update is the schedule-killer, not the capture code.** Ship MVP browser-only; reserve calendar time for EV cert procurement + macOS CI notarization; split V1a (browser/AI) from V1b (Electron) so transcription doesn't wait on certs.
4. **Desktop auth can't reuse Next cookies.** Auth.js (Postgres sessions) over Clerk; **loopback `127.0.0.1` OAuth as primary**, custom `screenly://` scheme as fallback; PKCE → OS keychain.
5. **Signed URLs are the real privacy primitive — app-layer gating isn't enough.** MVP = public-by-unguessable-slug only. First non-public mode flips `requireSignedURLs=true` + a JWT minter sharing one `canAccess()` policy with resolvers. Note: the flip is forward-only (pre-flip manifests may already be cached/shared).
6. **Stream's free captions are a dead end for AI.** English-only, no word timestamps — and word timestamps are the keystone for search/chapters/interactive transcript/editing. Use dedicated ASR from V1 day one.
7. **There is no server-side cut in Cloudflare Stream.** Filler/silence removal + destructive trims have no native API. Ship non-destructive EDL/clip-range + Stream clip API first; defer an ffmpeg render farm to late V2/V3.
8. **Realtime + high-volume analytics fight serverless.** View events through batched `sendBeacon` → partitioned raw table → Inngest rollups → aggregate rows the dashboard reads. Defer live presence/comment-sync to V3 behind an explicit realtime layer (Durable Objects / Pusher / Ably); poll until then.
9. **Cloudflare Stream has no meaningful free tier** ($1/1k min stored/mo + $1/1k min delivered). "Everyone Free, one hard cap" needs a cap on **stored AND delivered** minutes + abuse guardrails before any public link is live — a viral video bills you.
10. **`MediaRecorder` buffers the whole blob in memory** until stop. Stream chunks into the tus upload and cap MVP recordings aggressively, or the impressive long demo is exactly what OOMs/fails-upload.
11. **`getDisplayMedia` audio is browser/OS-limited** (no tab/system audio on Safari/Firefox; Chrome macOS = tab audio only). "Mic-only at MVP" is a hard constraint, not just a scoping choice.
