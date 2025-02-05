import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { openAPI } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  plugins: [openAPI()],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  events: {
  async onUserSignUp(user) {
    user.emailVerified = true;
  },
}
} satisfies BetterAuthOptions);

export type Session = typeof auth.$infer.Session;