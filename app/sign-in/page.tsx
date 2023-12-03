import { Logo } from "@/components/logo";
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
      className="mx-auto w-[240px] flex flex-col gap-4 pt-12"
    >
      <Logo />
      <h1 className="text-2xl">Get started</h1>
      <Button type="submit" className="bg-gray-900">
        Sign in with GitHub
      </Button>
    </form>
  );
}
