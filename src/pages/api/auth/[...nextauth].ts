import NextAuth, { Profile } from "next-auth";
import Providers from "next-auth/providers";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { User } from "@prisma/client";
import prisma from "../../../dbClient";

function getProfileInfo(profile: Profile) {
  return {
    id: (profile.id as number).toString(),
    name: (profile.name || profile.login) as string,
    email: profile.email,
    image: profile.avatar_url as string,
  };
}

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      profile: getProfileInfo,
    }),
    Providers.GitLab({
      clientId: process.env.GITLAB_CLIENT_ID,
      clientSecret: process.env.GITLAB_CLIENT_SECRET,
      profile: getProfileInfo,
    }),
  ],
  callbacks: {
    async session(session, user: User) {
      session.userId = user.id;
      session.userRole = user.role;
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
});
