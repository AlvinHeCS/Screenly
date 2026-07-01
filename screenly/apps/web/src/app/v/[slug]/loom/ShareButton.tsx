"use client";

import { useEffect, useRef, useState } from "react";

import { api } from "~/trpc/react";

import { CopyLinkIcon } from "./icons/CopyLinkIcon";
import { ShareIcon } from "./icons/ShareIcon";

interface ShareButtonProps {
  videoId: string;
  canCreateShareLink: boolean;
}

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall back below for non-HTTPS/local browser restrictions.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
  } finally {
    textarea.remove();
  }
}

export function ShareButton({ videoId, canCreateShareLink }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const createShareLink = api.video.createShareLink.useMutation();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
    const path = window.location.pathname;
    const sharePath = canCreateShareLink
      ? `/v/${(await createShareLink.mutateAsync({ videoId })).slug}`
      : path;
    const shareUrl = new URL(sharePath, window.location.origin).toString();

    await copyText(shareUrl);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1800);
  };

  const label = copied
    ? "Copied"
    : createShareLink.isPending
      ? "Sharing"
      : "Share";

  return (
    <div className="flex h-[32px] shrink-0 items-stretch overflow-hidden rounded-[8px] bg-[#2c6ae4] text-white">
      <button
        type="button"
        data-testid="share-modal-button"
        disabled={createShareLink.isPending}
        onClick={handleCopy}
        className="flex items-center gap-[6px] px-[12px] text-[14px] font-medium transition-colors duration-[150ms] hover:bg-[#2458c7] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <ShareIcon className="h-[16px] w-[16px]" />
        {label}
      </button>
      <span className="w-px self-stretch bg-[rgba(255,255,255,0.25)]" />
      <button
        type="button"
        aria-label="Copy link"
        disabled={createShareLink.isPending}
        onClick={handleCopy}
        className="flex items-center px-[10px] transition-colors duration-[150ms] hover:bg-[#2458c7] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <CopyLinkIcon className="h-[16px] w-[16px]" />
      </button>
    </div>
  );
}
