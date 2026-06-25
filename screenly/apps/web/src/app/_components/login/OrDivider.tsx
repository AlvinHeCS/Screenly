// "or" separator between the OAuth providers and the email form, with a hair
// line flanking the label on each side.
export function OrDivider() {
  return (
    <div className="mb-[24px] flex items-center">
      <span className="h-px flex-1 bg-[#DCDCE3]" />
      <span className="px-[16px] text-[14px] text-[#6B6B76]">or</span>
      <span className="h-px flex-1 bg-[#DCDCE3]" />
    </div>
  );
}
