"use client";

import type { SyntheticEvent } from "react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import { useRecorder } from "./RecorderContext";
import { CloseIcon } from "./icons/CloseIcon";

type UploadState = "idle" | "uploading" | "error";

// Cloudflare's direct-creator-upload single POST is capped at 200 MB; larger
// recordings need the resumable (tus) path, which is a follow-up.
const MAX_UPLOAD_BYTES = 200 * 1024 * 1024;

/**
 * Shown once recording stops: a playback preview of the composited WebM, a
 * Download action, and an Upload action that pushes the recording to Cloudflare
 * Stream and returns the user to the library (where it appears as Processing,
 * then Ready). Upload is resumable across retries and cancellable; a failed or
 * cancelled attempt marks the reserved row failed rather than orphaning it.
 */
export function ReviewPanel() {
  const {
    recordedUrl,
    recordedType,
    recordedBlob,
    elapsedSec,
    cameraOn,
    close,
    open,
  } = useRecorder();
  const router = useRouter();

  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const createUpload = api.video.createUpload.useMutation();
  const markUploaded = api.video.markUploaded.useMutation();
  const markFailed = api.video.markFailed.useMutation();

  // Survives across retries so a failed `markUploaded` doesn't re-reserve a
  // second Cloudflare asset or re-POST the blob.
  const uploadRef = useRef<{
    videoId: string;
    uploadURL: string;
    uploaded: boolean;
  } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const isUploading = uploadState === "uploading";

  const extension = recordedType?.includes("mp4") ? "mp4" : "webm";
  const downloadName = `screen-recording-${new Date()
    .toISOString()
    .replace(/[:.]/g, "-")}.${extension}`;

  // MediaRecorder WebM has no duration in its header, so the <video> reports
  // duration === Infinity and the scrubber can't seek. Force the browser to
  // compute it by seeking to the end once, then back to the start.
  const handleLoadedMetadata = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (video.duration !== Infinity || Number.isNaN(video.duration)) return;
    const onTimeUpdate = () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.currentTime = 0;
    };
    video.addEventListener("timeupdate", onTimeUpdate);
    video.currentTime = 1e101;
  };

  const handleUpload = async () => {
    if (!recordedBlob || isUploading) return;
    if (recordedBlob.size > MAX_UPLOAD_BYTES) {
      setUploadState("error");
      setUploadError(
        "This recording is over 200 MB, which is too large to upload right now. Download it instead.",
      );
      return;
    }

    setUploadState("uploading");
    setUploadError(null);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // 1. Reserve the Cloudflare asset + row once (reused on retry).
      if (!uploadRef.current) {
        const { videoId, uploadURL } = await createUpload.mutateAsync({
          mode: cameraOn ? "BOTH" : "SCREEN",
          durationSec: elapsedSec > 0 ? elapsedSec : undefined,
        });
        uploadRef.current = { videoId, uploadURL, uploaded: false };
      }
      const reserved = uploadRef.current;

      // 2. Upload the blob straight to Cloudflare once.
      if (!reserved.uploaded) {
        const form = new FormData();
        form.append("file", recordedBlob, downloadName);
        let res: Response;
        try {
          res = await fetch(reserved.uploadURL, {
            method: "POST",
            body: form,
            signal: controller.signal,
          });
        } catch (err) {
          if (controller.signal.aborted) throw err; // handled below as a cancel
          await markFailed
            .mutateAsync({ videoId: reserved.videoId })
            .catch(() => undefined);
          uploadRef.current = null;
          throw new Error(
            "Upload failed. Check your connection and try again.",
          );
        }
        if (!res.ok) {
          await markFailed
            .mutateAsync({ videoId: reserved.videoId })
            .catch(() => undefined);
          uploadRef.current = null;
          throw new Error(`Upload failed (${res.status}).`);
        }
        reserved.uploaded = true;
      }

      // 3. Flip the row to processing (idempotent — safe to re-run on retry).
      await markUploaded.mutateAsync({ videoId: reserved.videoId });

      uploadRef.current = null;
      abortRef.current = null;
      close();
      router.refresh();
    } catch (err) {
      abortRef.current = null;
      if (controller.signal.aborted) {
        // User cancelled — release the reserved row, reset quietly.
        const reserved = uploadRef.current;
        if (reserved && !reserved.uploaded) {
          await markFailed
            .mutateAsync({ videoId: reserved.videoId })
            .catch(() => undefined);
        }
        uploadRef.current = null;
        setUploadState("idle");
        setUploadError(null);
        return;
      }
      setUploadState("error");
      setUploadError(
        err instanceof Error ? err.message : "Something went wrong uploading.",
      );
    }
  };

  // Close is always available — during an upload it aborts (which cleans up the
  // reserved row) and then dismisses, so the user is never trapped.
  const handleClose = () => {
    if (isUploading) abortRef.current?.abort();
    close();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recorder-review-title"
      className="flex w-[640px] max-w-[calc(100vw-64px)] flex-col overflow-hidden rounded-[12px] bg-white text-[hsla(228,6%,17%,1)] shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
    >
      <div className="flex items-center justify-between px-[16px] py-[12px]">
        <h2 id="recorder-review-title" className="text-[16px] font-semibold">
          Recording ready
        </h2>
        <button
          type="button"
          aria-label="Close"
          onClick={handleClose}
          className="inline-flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[6px] bg-transparent p-0 text-[hsla(228,6%,17%,1)] transition-colors duration-200 hover:bg-[hsla(209,75.6%,8%,0.08)]"
        >
          <CloseIcon className="h-[16px] w-[16px]" />
        </button>
      </div>

      <div className="bg-black">
        {recordedUrl ? (
          <video
            src={recordedUrl}
            controls
            autoPlay
            onLoadedMetadata={handleLoadedMetadata}
            className="aspect-video w-full"
          />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center text-[14px] text-white">
            Preparing preview…
          </div>
        )}
      </div>

      {uploadError ? (
        <p
          role="alert"
          className="mx-[16px] mt-[12px] rounded-[8px] bg-[hsla(11.2,100%,58%,0.1)] px-[12px] py-[8px] text-[12px] font-medium text-[hsla(11.2,100%,40%,1)]"
        >
          {uploadError}
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-[8px] px-[16px] py-[12px]">
        <button
          type="button"
          onClick={open}
          disabled={isUploading}
          className="inline-flex h-[40px] cursor-pointer items-center rounded-[8px] border border-[hsla(225.5,57%,10%,0.14)] bg-white px-[16px] text-[14px] font-medium text-[hsla(228,6%,17%,1)] transition-colors duration-200 hover:bg-[hsla(209,75.6%,8%,0.08)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Record another
        </button>
        <a
          href={recordedUrl ?? undefined}
          download={downloadName}
          aria-disabled={recordedUrl === null}
          className={`inline-flex h-[40px] items-center rounded-[8px] border border-[hsla(225.5,57%,10%,0.14)] px-[16px] text-[14px] font-medium text-[hsla(228,6%,17%,1)] transition-colors duration-200 ${
            recordedUrl
              ? "cursor-pointer hover:bg-[hsla(209,75.6%,8%,0.08)]"
              : "pointer-events-none cursor-not-allowed opacity-50"
          }`}
        >
          Download
        </a>
        <button
          type="button"
          onClick={() => void handleUpload()}
          disabled={!recordedBlob || isUploading}
          className="inline-flex h-[40px] min-w-[140px] cursor-pointer items-center justify-center rounded-[8px] bg-[hsla(215.4,80%,47.65%,1)] px-[16px] text-[14px] font-medium text-white transition-colors duration-200 hover:bg-[hsla(216.1,81.4%,60%,1)] disabled:cursor-not-allowed disabled:bg-[hsla(215.4,40%,70%,1)]"
        >
          {isUploading
            ? "Uploading…"
            : uploadState === "error"
              ? "Retry upload"
              : "Upload to library"}
        </button>
      </div>
    </div>
  );
}
