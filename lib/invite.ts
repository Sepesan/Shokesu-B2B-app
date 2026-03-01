import { prisma } from "@/lib/prisma";

export async function assertInvitedEmail(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { email } });
  return Boolean(user && user.invited && !user.revoked);
}
