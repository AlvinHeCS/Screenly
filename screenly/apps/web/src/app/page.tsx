import { redirect } from "next/navigation";

import { auth } from "@screenly/auth";

import { LoginView } from "./_components/login/LoginView";

export default async function Home() {
  const session = await auth();

  // Signed-in users skip the login page and land straight on their videos
  // dashboard — the mirror of the /videos guard that bounces signed-out
  // visitors back here.
  if (session?.user) {
    redirect("/videos");
  }

  return <LoginView />;
}
