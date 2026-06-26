"use client";

import type { SyntheticEvent } from "react";

import { useRecorder } from "./RecorderContext";
import { CloseIcon } from "./icons/CloseIcon";

/**
 * Shown once recording stops: a playback preview of the composited WebM plus a
 * Download action. Upload to Cloudflare Stream is the next task, so that button
 * is present but disabled. "Record another" / Close discards the take and
 * returns to idle.
 */
export function ReviewPanel() {
  const { recordedUrl, recordedType, close, open } = useRecorder();

  // Safari falls back to mp4 when no WebM profile is supported; name the file to
  // match the actual container instead of always claiming .webm.
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
          onClick={close}
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

      <div className="flex items-center justify-end gap-[8px] px-[16px] py-[12px]">
        <button
          type="button"
          onClick={open}
          className="inline-flex h-[40px] cursor-pointer items-center rounded-[8px] border border-[hsla(225.5,57%,10%,0.14)] bg-white px-[16px] text-[14px] font-medium text-[hsla(228,6%,17%,1)] transition-colors duration-200 hover:bg-[hsla(209,75.6%,8%,0.08)]"
        >
          Record another
        </button>
        <a
          href={recordedUrl ?? undefined}
          download={downloadName}
          aria-disabled={recordedUrl === null}
          className={`inline-flex h-[40px] items-center rounded-[8px] px-[16px] text-[14px] font-medium text-white transition-colors duration-200 ${
            recordedUrl
              ? "cursor-pointer bg-[hsla(215.4,80%,47.65%,1)] hover:bg-[hsla(216.1,81.4%,60%,1)]"
              : "pointer-events-none cursor-not-allowed bg-[hsla(215.4,40%,70%,1)]"
          }`}
        >
          Download
        </a>
        <button
          type="button"
          disabled
          title="Uploading to the cloud is coming next"
          className="inline-flex h-[40px] cursor-not-allowed items-center rounded-[8px] bg-[hsla(209,76%,8%,0.08)] px-[16px] text-[14px] font-medium text-[hsla(224,5%,44%,1)]"
        >
          Upload (next)
        </button>
      </div>
    </div>
  );
}
