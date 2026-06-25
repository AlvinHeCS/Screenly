import { signInWithGoogle } from "./actions";
import { EmailSignInForm } from "./EmailSignInForm";
import { GoogleIcon } from "./icons/GoogleIcon";
import { SlackIcon } from "./icons/SlackIcon";
import { AppleIcon } from "./icons/AppleIcon";
import { OutlookIcon } from "./icons/OutlookIcon";
import { SsoIcon } from "./icons/SsoIcon";
import { LoginNavBar } from "./LoginNavBar";
import { OAuthButton } from "./OAuthButton";
import { OrDivider } from "./OrDivider";

// Loom login screen. Only Google is wired to the real auth flow; the remaining
// providers are present for visual parity but are not functional yet.
export function LoginView() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <LoginNavBar />

      <main className="flex flex-1 items-center justify-center px-[20px] py-[40px]">
        <div className="w-full max-w-[400px]">
          <h1 className="mb-[32px] text-center text-[28px] font-bold leading-[1.2] text-[#16161D]">
            Log in to Loom
          </h1>

          <div className="mb-[24px] flex w-full flex-col gap-[12px]">
            <form action={signInWithGoogle} className="w-full">
              <OAuthButton
                type="submit"
                ariaLabel="Log in with Google"
                label="Log in with Google"
                icon={<GoogleIcon className="h-[24px] w-[24px]" />}
              />
            </form>
            <OAuthButton
              ariaLabel="Log in with Slack"
              label="Log in with Slack"
              icon={<SlackIcon className="h-[24px] w-[24px]" />}
            />
            <OAuthButton
              ariaLabel="Log in with Apple"
              label="Log in with Apple"
              icon={<AppleIcon className="h-[24px] w-[24px]" />}
            />
            <OAuthButton
              ariaLabel="Log in with Outlook"
              label="Log in with Outlook"
              icon={<OutlookIcon className="h-[24px] w-[24px]" />}
            />
            <OAuthButton
              ariaLabel="Log in with Single Sign-on"
              label="Log in with SSO"
              icon={<SsoIcon className="h-[16px] w-[16px]" />}
            />
          </div>

          <OrDivider />

          <EmailSignInForm />

          <p className="text-[13px] leading-[1.5] text-[#6B6B76]">
            By signing up, you acknowledge that you have read and understood,
            and agree to Atlassian&rsquo;s{" "}
            <a
              href="https://www.atlassian.com/legal/atlassian-customer-agreement"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#625DF5] hover:underline"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="https://www.atlassian.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#625DF5] hover:underline"
            >
              Privacy Policy
            </a>
            .
          </p>

          <div className="mt-[24px]">
            <span className="block text-center text-[14px] text-[#8A8A94]">
              Can&rsquo;t log in?{" "}
              <a
                href="https://support.atlassian.com/loom/docs/cant-access-my-account/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#625DF5] hover:underline"
              >
                Troubleshoot
              </a>
              .
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
