import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await requireUser();
  const form = await req.formData();
  const interestId = String(form.get("interestId"));
  await prisma.bottleInterest.deleteMany({ where: { id: interestId, userId: user.id } });
  return NextResponse.redirect(new URL("/account/interests", req.url));
}
