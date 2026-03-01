import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const form = await req.formData();
    const bottleId = String(form.get("bottleId"));
    const qty = Number(form.get("qty") ?? 1);
    let request = await prisma.request.findFirst({ where: { userId: user.id, status: "PENDING" } });
    if (!request) request = await prisma.request.create({ data: { userId: user.id } });
    await prisma.requestItem.create({ data: { requestId: request.id, bottleId, qtyRequested: qty } });
    return NextResponse.redirect(new URL("/catalog", req.url));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
