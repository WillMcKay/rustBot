import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import Steam from "next-auth-steam";
import type { NextRequest } from "next/server";

export const authOptions: NextAuthOptions = {
  providers: [
    Steam(undefined as unknown as NextRequest, {
      clientSecret: process.env.STEAM_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, profile }) {
      if (profile && "steamid" in profile) {
        token.steamId = String(profile.steamid);
      }

      if (!token.steamId && token.sub) {
        token.steamId = token.sub;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.steamId = token.steamId as string | undefined;
      }

      return session;
    },
  },
};

async function auth(
  req: NextRequest,
  ctx: {
    params: {
      nextauth: string[];
    };
  }
) {
  return NextAuth(req, ctx, {
    ...authOptions,
    providers: [
      Steam(req, {
        clientSecret: process.env.STEAM_SECRET!,
      }),
    ],
  });
}

export { auth as GET, auth as POST };
