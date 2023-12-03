import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/prisma";

export const config = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      authorization: {
        params: {
          scope: "admin:org",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
    // authorized({ request, auth }) {
    //   const { pathname } = request.nextUrl;
    //   console.log("authorized", { pathname, auth });
    //   if (pathname === "/onboarding") return !!auth;
    //   return true;
    // },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);

export async function getGithubAccessToken() {
  const session = await auth();

  if (!session) {
    throw new Error("Session not found");
  }

  if (!session.user) {
    throw new Error("User not found");
  }

  const githubAccount = await prisma.account.findFirstOrThrow({
    where: {
      userId: session.user.id,
      provider: "github",
    },
  });

  return githubAccount.access_token;
}
