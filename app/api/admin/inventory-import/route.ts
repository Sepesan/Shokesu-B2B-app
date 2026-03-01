import { importInventoryWorkbook } from "@/lib/importers";
import { requireAdmin } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await requireAdmin();
  const form = await req.formData();
  const file = form.get("file") as File;
  const result = await importInventoryWorkbook(Buffer.from(await file.arrayBuffer()));
  return NextResponse.json(result);
}
