/**
 * Cloudflare Stream boundary. Wraps the Stream REST API for direct creator
 * uploads (the browser uploads the recording straight to Cloudflare, never
 * through our server), status polling, deletion, and webhook verification.
 *
 * Credentials come from the environment (validated as optional in
 * apps/web/src/env.js). When they're absent, `isStreamConfigured()` is false and
 * the calling tRPC procedures surface a clean "not configured" error instead of
 * throwing deep in a fetch.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const STREAM_TOKEN = process.env.CLOUDFLARE_STREAM_TOKEN;
const WEBHOOK_SECRET = process.env.STREAM_WEBHOOK_SECRET;

const API_BASE = "https://api.cloudflare.com/client/v4";

/** True only when both the account id and an API token are present. */
export function isStreamConfigured(): boolean {
  return Boolean(ACCOUNT_ID && STREAM_TOKEN);
}

function streamUrl(path = ""): string {
  return `${API_BASE}/accounts/${ACCOUNT_ID}/stream${path}`;
}

interface CfEnvelope<T> {
  success: boolean;
  result: T;
  errors?: { code: number; message: string }[];
}

async function cfFetch<T>(url: string, init?: RequestInit): Promise<T> {
  if (!isStreamConfigured()) {
    throw new Error(
      "Cloudflare Stream is not configured. Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_STREAM_TOKEN.",
    );
  }
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${STREAM_TOKEN}`,
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  let body: CfEnvelope<T>;
  try {
    body = (
      text ? JSON.parse(text) : { success: res.ok, result: undefined }
    ) as CfEnvelope<T>;
  } catch {
    // Non-JSON body (edge/gateway error page, WAF challenge) — fall through to
    // the structured error below instead of throwing a raw SyntaxError.
    body = { success: false, result: undefined as T };
  }
  if (!res.ok || !body.success) {
    const detail =
      body.errors?.map((e) => e.message).join("; ") || res.statusText;
    throw new Error(`Cloudflare Stream API error (${res.status}): ${detail}`);
  }
  return body.result;
}

export interface DirectUpload {
  /** Stream asset id — stored as Video.cloudflareUid. */
  uid: string;
  /** One-time URL the browser POSTs the recording to (multipart form, field "file"). */
  uploadURL: string;
}

/** Create a one-time direct-creator-upload URL + reserve a Stream asset uid. */
export async function createDirectUpload(opts: {
  name?: string;
  maxDurationSeconds?: number;
}): Promise<DirectUpload> {
  return cfFetch<DirectUpload>(streamUrl("/direct_upload"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      maxDurationSeconds: Math.max(1, opts.maxDurationSeconds ?? 3600),
      requireSignedURLs: false,
      ...(opts.name ? { meta: { name: opts.name } } : {}),
    }),
  });
}

export interface StreamVideo {
  uid: string;
  readyToStream: boolean;
  status: { state: string; errorReasonText?: string };
  /** Seconds; -1 until Cloudflare has probed the file. */
  duration: number;
  thumbnail: string;
  preview: string;
}

export async function getStreamVideo(uid: string): Promise<StreamVideo> {
  return cfFetch<StreamVideo>(streamUrl(`/${encodeURIComponent(uid)}`));
}

export async function deleteStreamVideo(uid: string): Promise<void> {
  await cfFetch(streamUrl(`/${encodeURIComponent(uid)}`), { method: "DELETE" });
}

/**
 * Verify a Cloudflare Stream webhook. The `Webhook-Signature` header looks like
 * `time=1700000000,sig1=<hex>`; the signed payload is `${time}.${rawBody}`,
 * HMAC-SHA256 with STREAM_WEBHOOK_SECRET. Returns false (rather than throwing)
 * on any malformed or mismatched input so the route can reply 403.
 */
export function verifyStreamWebhook(
  signatureHeader: string | null,
  rawBody: string,
): boolean {
  if (!WEBHOOK_SECRET || !signatureHeader) return false;
  const parts: Record<string, string> = {};
  for (const segment of signatureHeader.split(",")) {
    const idx = segment.indexOf("=");
    if (idx > 0) parts[segment.slice(0, idx).trim()] = segment.slice(idx + 1).trim();
  }
  const time = parts.time;
  const sig = parts.sig1;
  if (!time || !sig) return false;

  const expected = createHmac("sha256", WEBHOOK_SECRET)
    .update(`${time}.${rawBody}`)
    .digest("hex");

  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(sig, "hex");
  if (a.length === 0 || a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// ──────────────────────────── Generated captions ────────────────────────────

/** A single transcript line: text plus its start offset in the video. */
export interface TranscriptCue {
  startMs: number;
  text: string;
}

/** AI-caption lifecycle as Cloudflare reports it. */
export type CaptionStatus = "inprogress" | "ready" | "error";

interface CfCaption {
  language?: string;
  label?: string;
  generated?: boolean;
  status?: CaptionStatus;
}

/** Kick off AI caption generation for a language. */
export async function generateCaptions(
  uid: string,
  language: string,
): Promise<void> {
  await cfFetch(
    streamUrl(`/${encodeURIComponent(uid)}/captions/${language}/generate`),
    { method: "POST" },
  );
}

/**
 * Delete a language's captions. Best-effort: a 404 (no entry) counts as success
 * so callers can "clear then regenerate" — Cloudflare's generate endpoint 409s
 * when an entry already exists.
 */
export async function deleteCaptions(
  uid: string,
  language: string,
): Promise<void> {
  if (!isStreamConfigured()) return;
  const res = await fetch(
    streamUrl(`/${encodeURIComponent(uid)}/captions/${language}`),
    { method: "DELETE", headers: { Authorization: `Bearer ${STREAM_TOKEN}` } },
  );
  if (!res.ok && res.status !== 404) {
    throw new Error(`Cloudflare caption delete failed (${res.status}).`);
  }
}

/** Status of a language's captions, or null if no entry exists yet. */
export async function getCaptionStatus(
  uid: string,
  language: string,
): Promise<CaptionStatus | null> {
  const list = await cfFetch<CfCaption[]>(
    streamUrl(`/${encodeURIComponent(uid)}/captions`),
  );
  const entry = Array.isArray(list)
    ? list.find((c) => c.language === language)
    : undefined;
  if (!entry) return null;
  return entry.status ?? "ready";
}

/** Download the raw WebVTT for a language. */
export async function getCaptionVtt(
  uid: string,
  language: string,
): Promise<string> {
  const res = await fetch(
    streamUrl(`/${encodeURIComponent(uid)}/captions/${language}/vtt`),
    { headers: { Authorization: `Bearer ${STREAM_TOKEN}` } },
  );
  if (!res.ok) {
    throw new Error(`Cloudflare caption VTT fetch failed (${res.status}).`);
  }
  return res.text();
}

const TIMESTAMP_RE = /^(?:(\d+):)?(\d{1,2}):(\d{2})(?:[.,](\d{1,3}))?$/;

function parseTimestamp(raw: string): number | null {
  const m = TIMESTAMP_RE.exec(raw.trim());
  if (!m) return null;
  const hours = m[1] ? Number(m[1]) : 0;
  const minutes = Number(m[2]);
  const seconds = Number(m[3]);
  const millis = m[4] ? Number(m[4].padEnd(3, "0")) : 0;
  return ((hours * 60 + minutes) * 60 + seconds) * 1000 + millis;
}

function cleanCueText(text: string): string {
  return text
    .replace(/<[^>]*>/g, "") // voice/class/timestamp tags
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parse WebVTT into `{ startMs, text }` cues. Tolerant of cue ids, NOTE/STYLE
 * blocks, cue settings after the end time, and inline tags.
 */
export function parseVtt(vtt: string): TranscriptCue[] {
  const cues: TranscriptCue[] = [];
  const blocks = vtt
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split(/\n\n+/);

  for (const block of blocks) {
    const lines = block.split("\n");
    const timingIdx = lines.findIndex((l) => l.includes("-->"));
    if (timingIdx === -1) continue;

    const startRaw = lines[timingIdx]!.split("-->")[0]!;
    const startMs = parseTimestamp(startRaw);
    if (startMs === null) continue;

    const text = cleanCueText(lines.slice(timingIdx + 1).join(" "));
    if (text) cues.push({ startMs, text });
  }

  return cues;
}
