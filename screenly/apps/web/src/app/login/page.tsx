import { redirect } from "next/navigation";

import { auth } from "@screenly/auth";

import { LoginView } from "../_components/login/LoginView";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/videos");
  }

  return <LoginView />;
}
