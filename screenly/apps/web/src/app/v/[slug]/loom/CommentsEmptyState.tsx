interface CommentsEmptyStateProps {
  ownerFirstName: string;
}

/**
 * Loom's "Be the first to comment" empty state shown on the Activity tab,
 * including the inline keyboard hint to press "C".
 */
export function CommentsEmptyState({ ownerFirstName }: CommentsEmptyStateProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[12px] px-[24px] py-[24px] text-center">
      <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)]">
        <span aria-hidden="true" className="text-[28px] text-[#ff9d4d]">
          💬
        </span>
      </div>
      <span className="text-[15px] font-bold text-white">
        Be the first to comment
      </span>
      <p className="text-[13px] font-normal leading-[20px] text-[rgba(255,255,255,0.6)]">
        Hit{" "}
        <span className="inline-flex h-[20px] min-w-[20px] items-center justify-center rounded-[4px] bg-[rgba(255,255,255,0.12)] px-[5px] align-middle text-[12px] font-bold text-[rgba(255,255,255,0.85)]">
          C
        </span>{" "}
        to reply to {ownerFirstName} or leave a comment at the top of this panel.
      </p>
    </div>
  );
}
