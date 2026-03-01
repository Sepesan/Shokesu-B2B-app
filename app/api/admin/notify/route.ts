import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
  auth: { user: process.env.EMAIL_SERVER_USER, pass: process.env.EMAIL_SERVER_PASSWORD }
});

export async function POST(req: Request) {
  await requireAdmin();
  const form = await req.formData();
  const bottleId = String(form.get("bottleId"));
  const selected = form.getAll("userId").map(String);
  const bottle = await prisma.bottle.findUnique({ where: { id: bottleId } });
  const interests = await prisma.bottleInterest.findMany({ where: { bottleId, ...(selected.length ? { userId: { in: selected } } : {}) }, include: { user: true } });
  for (const i of interests) {
    await transporter.sendMail({
      to: i.user.email,
      from: process.env.EMAIL_FROM,
      subject: `${bottle?.name} is available at Shokesu`,
      html: `<p>${bottle?.name} may be available.</p><img src="${bottle?.imageUrl}" /><p><a href="${process.env.NEXTAUTH_URL}/bottle/${bottleId}">View bottle</a></p>`
    });
  }
  return NextResponse.redirect(new URL("/admin/interests", req.url));
}
