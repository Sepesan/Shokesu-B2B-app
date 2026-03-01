import { approveRequest } from "@/lib/request-approval";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await requireAdmin();
  const form = await req.formData();
  const requestId = String(form.get("requestId"));
  const action = String(form.get("action"));
  if (action === "APPROVE") await approveRequest(requestId);
  if (action === "DENY") await prisma.request.update({ where: { id: requestId }, data: { status: "DENIED" } });
  return NextResponse.redirect(new URL("/admin/requests", req.url));
}
