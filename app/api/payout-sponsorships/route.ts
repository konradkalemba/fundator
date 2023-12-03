import { prisma } from "@/lib/prisma";
import { Octokit } from "@octokit/core";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const sponsorships = await prisma.sponsorship.findMany({
    select: {
      id: true,
      recipients: {
        select: {
          login: true,
          amount: true,
        },
      },
      organization: {
        select: {
          login: true,
          owner: {
            select: {
              accounts: {
                select: { access_token: true },
                where: {
                  provider: "github",
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  for (const sponsorship of sponsorships) {
    const { accounts } = sponsorship.organization.owner;
    const { access_token } = accounts[0];

    for (const recipient of sponsorship.recipients) {
      const octokit = new Octokit({
        auth: access_token,
      });

      await octokit.graphql(
        `mutation ($input) {
          createSponsorship(input: $input) {
            sponsorship {
              id
            }
          }
        }`,
        {
          input: {
            sponsorLogin: sponsorship.organization.login,
            sponsorableLogin: recipient.login,
            amount: recipient.amount,
            isRecurring: false,
          },
        }
      );
    }
  }

  return new NextResponse("OK", {
    status: 200,
  });
}
