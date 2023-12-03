import { auth } from "@/lib/auth";
import { Octokit } from "@octokit/core";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/logo";
import { FinishOnboardingForm } from "../forms/finish-onboarding-form";

export default async function Onboarding() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  const githubAccount = await prisma.account.findFirstOrThrow({
    where: {
      userId: session.user.id,
      provider: "github",
    },
  });

  const octokit = new Octokit({
    auth: githubAccount.access_token,
  });

  const githubOrganizations = await octokit.request("GET /user/orgs");

  return (
    <div className="container flex flex-col pt-12 gap-4">
      <Logo />

      <h1 className="text-2xl">Let&apos;s setup</h1>
      <div className="mx-auto w-[320px] rounded-md border shadow-sm bg-white border-gray-100 p-3 flex flex-col gap-2">
        <p>
          Please select a GitHub organization to start creating sponsorships.
        </p>

        <FinishOnboardingForm githubOrganizations={githubOrganizations.data} />
      </div>
    </div>
  );
}
