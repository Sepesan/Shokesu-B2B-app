import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@/lib/prisma";
import { assertInvitedEmail } from "@/lib/invite";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
  auth: { user: process.env.EMAIL_SERVER_USER, pass: process.env.EMAIL_SERVER_PASSWORD }
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url, provider }) {
        await transporter.sendMail({
          to: identifier,
          from: provider.from,
          subject: "Your Shokesu sign-in link",
          html: `<p>Sign in to Shokesu portal:</p><p><a href=\"${url}\">${url}</a></p>`
        });
      }
    })
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      return assertInvitedEmail(user.email);
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    }
  }
};
