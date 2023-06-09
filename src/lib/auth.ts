import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";
import { getEnvVariable } from "./utils";
import { fetchRedis } from "@/helpers/redis";

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: getEnvVariable("GOOGLE_CLIENT_ID"),
      clientSecret: getEnvVariable("GOOGLE_CLIENT_SECRET"),
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // const dbUser = (await db.get(`user:${token.id}`)) as User | null;
      const dbUserResponse = (await fetchRedis("get", `user:${token.id}`)) as
        | string
        | null;

      if (!dbUserResponse) {
        token.id = user!.id;
        return token;
      }

      const dbUser = JSON.parse(dbUserResponse) as User;

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
    redirect() {
      return "/dashboard";
    },
  },
  secret: getEnvVariable("LOCAL_SECRET"),
};
