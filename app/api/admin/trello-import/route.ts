import { parseTrelloCards, upsertTrello } from "@/lib/importers";
import { requireAdmin } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await requireAdmin();
  const form = await req.formData();
  const file = form.get("file") as File;
  const dryRun = String(form.get("dryRun") ?? "true") === "true";
  const payload = JSON.parse(await file.text());
  const cards = parseTrelloCards(payload);
  const result = await upsertTrello(cards, dryRun);
  return NextResponse.json(result);
}
