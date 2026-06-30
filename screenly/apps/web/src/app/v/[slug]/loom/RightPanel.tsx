"use client";

import { useState } from "react";

import { CommentsEmptyState } from "./CommentsEmptyState";
import { TranscriptTab, type TranscriptCue } from "./TranscriptTab";
import { CopyLinkIcon } from "./icons/CopyLinkIcon";

const TABS = ["Edit", "Activity", "Transcript", "Settings"] as const;
type Tab = (typeof TABS)[number];

interface RightPanelProps {
  ownerFirstName: string;
  transcriptState: "loading" | "ready" | "unavailable" | "waiting";
  cues: TranscriptCue[];
  onSeek?: (startMs: number) => void;
}

/**
 * Loom's right sidebar with the same tab strip and light panel treatment as the
 * supplied reference. Defaults to Transcript for the watch route.
 */
export function RightPanel({
  ownerFirstName,
  transcriptState,
  cues,
  onSeek,
}: RightPanelProps) {
  const [active, setActive] = useState<Tab>("Transcript");

  return (
    <aside className="flex w-full min-w-0 shrink-0 flex-col border-t border-[#ececef] bg-white lg:sticky lg:top-[56px] lg:h-[calc(100vh-56px)] lg:w-[435px] lg:border-l lg:border-t-0">
      <div
        role="tablist"
        aria-label="Video sidebar tabs"
        className="flex h-[64px] min-w-0 shrink-0 items-end gap-[20px] overflow-x-auto border-b border-[#f0f0f2] px-[24px]"
      >
        {TABS.map((tab) => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab)}
              className={`relative h-[44px] shrink-0 px-0 text-[14px] font-semibold leading-[20px] transition-colors duration-[150ms] ${
                isActive
                  ? "text-[#0c66e4]"
                  : "text-[#6a6a73] hover:text-[#1d1c20]"
              }`}
            >
              {tab}
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[#0c66e4]" />
              )}
            </button>
          );
        })}

        <button
          type="button"
          aria-label="Hide sidebar"
          className="mb-[16px] ml-auto hidden h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[6px] text-[#8a8a93] transition-colors duration-[150ms] hover:bg-[#f4f4f6] hover:text-[#1d1c20] lg:flex"
        >
          <DoubleChevronIcon className="h-[16px] w-[16px]" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        {active === "Transcript" ? (
          <TranscriptTab state={transcriptState} cues={cues} onSeek={onSeek} />
        ) : active === "Activity" ? (
          <CommentsEmptyState ownerFirstName={ownerFirstName} />
        ) : active === "Edit" ? (
          <EditPanel />
        ) : (
          <p className="px-[24px] py-[24px] text-[13px] leading-[20px] text-[#6a6a73]">
            No settings are available for this video.
          </p>
        )}
      </div>
    </aside>
  );
}

function EditPanel() {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-[24px] py-[20px]">
      <button
        type="button"
        className="group relative overflow-hidden rounded-[14px] p-px text-left"
      >
        <span className="absolute inset-0 bg-[linear-gradient(100deg,#4b7cff_0%,#8759ff_54%,#f0a33a_100%)]" />
        <span className="relative flex min-h-[96px] items-center gap-[16px] rounded-[13px] bg-white px-[20px] py-[18px] transition-colors duration-[150ms] group-hover:bg-[#fbfbfd]">
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-[6px] text-[18px] font-bold leading-[24px] text-[#24242b]">
              Get Loom Business + AI
              <SparkleIcon className="h-[14px] w-[14px] shrink-0" />
            </span>
            <span className="mt-[6px] block text-[13px] font-normal leading-[20px] text-[#6a6a73]">
              Create better videos with AI-powered titles, editing, workflows,
              and meeting recaps.{" "}
              <span className="font-semibold text-[#0c66e4]">Upgrade now</span>
            </span>
          </span>
          <ChevronRightIcon className="h-[18px] w-[18px] shrink-0 text-[#24242b]" />
        </span>
      </button>

      <h2 className="mt-[22px] text-[24px] font-bold leading-[32px] text-[#24242b]">
        Edit and enhance
      </h2>

      <div className="mt-[16px] flex flex-col gap-[12px]">
        <button
          type="button"
          className="group relative overflow-hidden rounded-[14px] p-px text-left"
        >
          <span className="absolute inset-0 bg-[linear-gradient(100deg,#4b7cff_0%,#8a63ff_60%,#f0a33a_100%)]" />
          <span className="relative flex h-[78px] items-center gap-[16px] rounded-[13px] bg-white px-[16px] transition-colors duration-[150ms] group-hover:bg-[#fbfbfd]">
            <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#f7f7f8] text-[#24242b]">
              <ScissorsIcon className="h-[21px] w-[21px]" />
            </span>
            <span className="min-w-0 flex-1 text-[15px] font-bold leading-[22px] text-[#24242b]">
              Edit and trim video
            </span>
            <ChevronRightIcon className="h-[18px] w-[18px] shrink-0 text-[#24242b]" />
          </span>
        </button>

        <button
          type="button"
          className="flex h-[64px] items-center gap-[16px] rounded-[14px] px-[8px] text-left transition-colors duration-[150ms] hover:bg-[#f7f7f8]"
        >
          <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#f7f7f8] text-[#24242b]">
            <CopyLinkIcon className="h-[20px] w-[20px]" />
          </span>
          <span className="min-w-0 flex-1 text-[15px] font-bold leading-[22px] text-[#24242b]">
            Add link
          </span>
          <span className="flex h-[32px] w-[54px] shrink-0 items-center justify-center rounded-full border border-[#d9d9de] bg-white text-[#6a6a73]">
            <LockIcon className="h-[16px] w-[16px]" />
          </span>
        </button>
      </div>
    </div>
  );
}

interface IconProps {
  className?: string;
}

function DoubleChevronIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="m8.28 1.47 6 6a.75.75 0 0 1 .052 1.004l-.052.056-6 6-1.06-1.06L12.69 8 7.22 2.53z"
      />
      <path
        fill="currentColor"
        d="m3.53 1.47 6 6a.75.75 0 0 1 .052 1.004l-.052.056-6 6-1.06-1.06L7.94 8 2.47 2.53z"
      />
    </svg>
  );
}

function SparkleIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M8 1.2c.42 0 .55.34.6.76.34 2.47 2.54 4.67 5 5 .42.05.76.18.76.6s-.34.55-.76.6c-2.46.33-4.66 2.54-5 5-.05.42-.18.76-.6.76s-.55-.34-.6-.76c-.34-2.46-2.54-4.67-5-5-.42-.05-.76-.18-.76-.6s.34-.55.76-.6c2.46-.33 4.66-2.53 5-5 .05-.42.18-.76.6-.76Z"
      />
    </svg>
  );
}

function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M6.03 3.47 10.56 8l-4.53 4.53-1.06-1.06L8.44 8 4.97 4.53z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ScissorsIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2 4.5a3.5 3.5 0 1 1 6.36 2.01l3.68 2.32L20.6 3.44l1.2 1.9-7.64 4.82 7.64 4.81-1.2 1.9-8.56-5.39-3.68 2.32A3.5 3.5 0 1 1 7.2 12l2.72-1.72L7.2 8.57A3.5 3.5 0 0 1 2 4.5Zm3.5-1.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm0 13a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LockIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8 1.5A2.5 2.5 0 0 0 5.5 4v3h5V4A2.5 2.5 0 0 0 8 1.5ZM12 7V4a4 4 0 0 0-8 0v3a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2ZM4 8.5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V9a.5.5 0 0 0-.5-.5Zm3.25 4.5v-3h1.5v3Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
