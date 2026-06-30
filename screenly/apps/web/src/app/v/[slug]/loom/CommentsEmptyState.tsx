interface CommentsEmptyStateProps {
  ownerFirstName: string;
}

/**
 * Loom's "Be the first to comment" empty state shown on the Activity tab,
 * including the inline keyboard hint to press "C".
 */
export function CommentsEmptyState({
  ownerFirstName,
}: CommentsEmptyStateProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[12px] px-[32px] py-[32px] text-center">
      <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#f7f7f8] text-[#0c66e4]">
        <CommentIcon className="h-[28px] w-[28px]" />
      </div>
      <span className="text-[15px] font-bold text-[#24242b]">
        Be the first to comment
      </span>
      <p className="text-[13px] font-normal leading-[20px] text-[#6a6a73]">
        Hit{" "}
        <span className="inline-flex h-[20px] min-w-[20px] items-center justify-center rounded-[4px] bg-[#f0f0f2] px-[5px] align-middle text-[12px] font-bold text-[#24242b]">
          C
        </span>{" "}
        to reply to {ownerFirstName} or leave a comment at the top of this
        panel.
      </p>
    </div>
  );
}

interface CommentIconProps {
  className?: string;
}

function CommentIcon({ className }: CommentIconProps) {
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
        d="M2 2.5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h2.5v2.25l3-2.25H14a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H8l-4.2 3.15A.5.5 0 0 1 3 14.75V12H2a2 2 0 0 1-2-2z"
        clipRule="evenodd"
      />
    </svg>
  );
}
