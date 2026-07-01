"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { ShareButton } from "./ShareButton";

interface TitleBarProps {
  videoId: string;
  title: string;
  ownerName: string;
  dateLabel: string;
  dateTime: string;
  canCreateShareLink: boolean;
  canEditTitle?: boolean;
  onTitleChange?: (title: string) => Promise<void> | void;
}

/**
 * The metadata row above the video: editable title, owner · date, and a views
 * badge pinned to the right. Mirrors Loom's `titleBarContainer` +
 * `titleBarViewsContainer`.
 */
export function TitleBar({
  videoId,
  title,
  ownerName,
  dateLabel,
  dateTime,
  canCreateShareLink,
  canEditTitle = false,
  onTitleChange,
}: TitleBarProps) {
  const [draftTitle, setDraftTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const saveInFlightRef = useRef(false);
  const titleEditable = canEditTitle && Boolean(onTitleChange);

  useEffect(() => {
    if (!isEditingTitle) setDraftTitle(title);
  }, [isEditingTitle, title]);

  useEffect(() => {
    if (!isEditingTitle) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditingTitle]);

  const startTitleEdit = () => {
    if (!titleEditable || isSavingTitle) return;
    setDraftTitle(title);
    setTitleError(null);
    setIsEditingTitle(true);
  };

  const cancelTitleEdit = () => {
    setDraftTitle(title);
    setTitleError(null);
    setIsEditingTitle(false);
  };

  const saveTitle = async () => {
    if (saveInFlightRef.current) return;

    const nextTitle = draftTitle.trim();
    if (!nextTitle || nextTitle === title) {
      cancelTitleEdit();
      return;
    }

    saveInFlightRef.current = true;
    setIsSavingTitle(true);
    setTitleError(null);
    try {
      await onTitleChange?.(nextTitle);
      setDraftTitle(nextTitle);
      setIsEditingTitle(false);
    } catch {
      setTitleError("Could not save title.");
      inputRef.current?.focus();
    } finally {
      saveInFlightRef.current = false;
      setIsSavingTitle(false);
    }
  };

  const handleTitleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void saveTitle();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      cancelTitleEdit();
    }
  };

  return (
    <div className="flex items-start justify-between gap-[16px] pb-[24px]">
      <div className="min-w-0 flex-1">
        <div className="contents">
          <div className="group flex min-w-0 items-center">
            <h1 className="min-w-0 flex-1 text-[28px] font-bold leading-[34px] text-[#24242b] max-sm:text-[20px] max-sm:leading-[28px]">
              {isEditingTitle ? (
                <input
                  ref={inputRef}
                  value={draftTitle}
                  maxLength={200}
                  readOnly={isSavingTitle}
                  aria-busy={isSavingTitle}
                  aria-label="Recording title"
                  aria-invalid={titleError ? true : undefined}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  onBlur={() => void saveTitle()}
                  onKeyDown={handleTitleKeyDown}
                  className="block w-full min-w-0 max-w-full rounded-[6px] border border-[#c7c7cd] bg-white px-[6px] py-[1px] text-[28px] font-bold leading-[34px] text-[#24242b] outline-none transition read-only:opacity-70 focus:border-[#625df5] focus:ring-[3px] focus:ring-[#625df533] max-sm:text-[20px] max-sm:leading-[28px]"
                />
              ) : titleEditable ? (
                <button
                  type="button"
                  aria-label="Edit recording title"
                  title="Edit title"
                  onClick={startTitleEdit}
                  className="-mx-[4px] block max-w-full truncate rounded-[6px] px-[4px] text-left text-[28px] font-bold leading-[34px] text-[#24242b] outline-none transition hover:bg-[#f5f5f7] focus-visible:ring-[3px] focus-visible:ring-[#625df533] max-sm:text-[20px] max-sm:leading-[28px]"
                >
                  {title}
                </button>
              ) : (
                <span className="block max-w-full truncate">{title}</span>
              )}
            </h1>
          </div>
        </div>
        {titleError ? (
          <p className="mt-[4px] text-[13px] leading-[18px] text-[#c23131]">
            {titleError}
          </p>
        ) : null}

        <div className="mt-[2px] flex flex-wrap items-center gap-x-[6px] gap-y-[2px] text-[15px] font-normal leading-[22px] text-[#6a6a73] max-sm:text-[13px] max-sm:leading-[20px]">
          <span className="text-[#6a6a73]">{ownerName}</span>
          <span className="text-[#c7c7cd]">・</span>
          <time dateTime={dateTime}>{dateLabel}</time>
        </div>
      </div>

      <ShareButton videoId={videoId} canCreateShareLink={canCreateShareLink} />
    </div>
  );
}
