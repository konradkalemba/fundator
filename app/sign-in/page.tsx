import { Button } from "@/components/ui/button";
import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await auth();

  if (session) {
    redirect("/onboarding");
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo: "/onboarding" });
      }}
    >
      <Button type="submit">Sign in with GitHub</Button>
    </form>
  );
}
