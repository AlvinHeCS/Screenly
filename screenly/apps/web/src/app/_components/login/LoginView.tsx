import { signInWithGoogle } from "./actions";
import { GoogleIcon } from "./icons/GoogleIcon";
import { LoginNavBar } from "./LoginNavBar";
import { OAuthButton } from "./OAuthButton";

// Login screen. Google is the only wired auth flow.
export function LoginView() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <LoginNavBar />

      <main className="flex flex-1 items-center justify-center px-[20px] py-[40px]">
        <div className="w-full max-w-[400px]">
          <h1 className="mb-[32px] text-center text-[28px] font-bold leading-[1.2] text-[#16161D]">
            Log in to Screenly
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
          </div>
        </div>
      </main>
    </div>
  );
}
