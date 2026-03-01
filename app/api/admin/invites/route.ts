import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await requireAdmin();
  const form = await req.formData();
  const email = String(form.get("email")).toLowerCase();
  await prisma.user.upsert({
    where: { email },
    create: { email, invited: true, role: "CLIENT" },
    update: { invited: true, revoked: false }
  });
  return NextResponse.redirect(new URL("/admin/invites", req.url));
}

export async function DELETE(req: Request) {
  await requireAdmin();
  const form = await req.formData();
  const userId = String(form.get("userId"));
  await prisma.user.update({ where: { id: userId }, data: { revoked: true } });
  return NextResponse.json({ ok: true });
}
