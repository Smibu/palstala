import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      profile(profile) {
        return {
          id: (profile.id as number).toString(),
          name: (profile.name || profile.login) as string,
          email: profile.email,
          image: profile.avatar_url as string,
        };
      },
    }),
  ],
  callbacks: {
    async session(session, user: User) {
      session.userId = user.id;
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
});
