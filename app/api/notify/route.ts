import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await requireUser();
  const form = await req.formData();
  const bottleId = String(form.get("bottleId"));
  await prisma.bottleInterest.upsert({
    where: { userId_bottleId_type: { userId: user.id, bottleId, type: "NOTIFY" } },
    create: { userId: user.id, bottleId, type: "NOTIFY" },
    update: {}
  });
  return NextResponse.redirect(new URL("/account/interests", req.url));
}
