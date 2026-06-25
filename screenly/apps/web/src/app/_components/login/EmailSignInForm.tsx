// Work-email capture. Email sign-in isn't wired up (Google OAuth is the only
// provider), so the "Continue" button stays disabled — matching the original
// page's initial render where the button is disabled until a valid email.
export function EmailSignInForm() {
  return (
    <div className="mb-[16px] w-full">
      <form className="flex flex-col" noValidate>
        <div className="mb-[16px] flex w-full flex-col">
          <label
            htmlFor="email"
            className="mb-[6px] text-[13px] font-medium text-[#16161D]"
          >
            Work email
          </label>
          <input
            type="email"
            placeholder="name@company.com"
            id="email"
            name="email"
            className="h-[48px] w-full rounded-[8px] border border-[#DCDCE3] bg-white px-[16px] text-[15px] text-[#16161D] placeholder:text-[#6B6B76] focus:border-[#625DF5] focus:outline-none focus:ring-1 focus:ring-[#625DF5]"
          />
        </div>
        <button
          id="email-signup-button"
          type="submit"
          disabled
          className="flex h-[48px] w-full items-center justify-center rounded-[8px] bg-[#625DF5] text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-[#514CDB] disabled:cursor-not-allowed disabled:bg-[#F1F1F4] disabled:text-[#A5A5B0] disabled:hover:bg-[#F1F1F4]"
        >
          <span>Continue</span>
        </button>
      </form>
    </div>
  );
}
