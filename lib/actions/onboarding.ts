"use server";

import { finishOnboardingSchema } from "@/lib/validations/onboarding";
import { auth, getGithubAccessToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Octokit } from "@octokit/core";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function finishOnboarding(
  data: z.infer<typeof finishOnboardingSchema>
) {
  const parsed = finishOnboardingSchema.parse(data);

  const session = await auth();

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  const githubAccessToken = await getGithubAccessToken();

  const octokit = new Octokit({
    auth: githubAccessToken,
  });

  const githubOrganization = await octokit.request("GET /orgs/{org}", {
    org: parsed.githubLogin,
  });

  const organization = await prisma.organization.create({
    data: {
      githubId: githubOrganization.data.id,
      login: githubOrganization.data.login,
      avatarUrl: githubOrganization.data.avatar_url,
      ownerId: session.user.id,
    },
  });

  redirect(`/organizations/${organization.id}/sponsorships`);
}
