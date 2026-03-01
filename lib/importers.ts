import { prisma } from "@/lib/prisma";
import { cleanDescription, normalizeName } from "@/lib/normalize";
import * as XLSX from "xlsx";

export function parseTrelloCards(payload: unknown) {
  const cards = (payload as any)?.cards ?? [];
  return cards.map((card: any) => {
    const atts = card.attachments ?? [];
    const cover = card.cover?.scaled?.[0]?.url || atts[0]?.url;
    return {
      trelloCardId: card.id,
      name: card.name,
      normalizedName: normalizeName(card.name),
      description: cleanDescription(card.desc),
      imageUrl: cover,
      galleryImages: atts.map((a: any) => a.url).filter(Boolean)
    };
  });
}

export async function upsertTrello(cards: ReturnType<typeof parseTrelloCards>, dryRun = true) {
  if (dryRun) return { count: cards.length, preview: cards.slice(0, 20) };
  for (const c of cards) {
    await prisma.bottle.upsert({
      where: { normalizedName: c.normalizedName },
      update: { ...c },
      create: { ...c }
    });
  }
  return { count: cards.length };
}

export async function importInventoryWorkbook(buffer: Buffer) {
  const wb = XLSX.read(buffer, { type: "buffer" });
  let imported = 0;
  for (const sheetName of wb.SheetNames) {
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(wb.Sheets[sheetName]);
    for (const row of rows) {
      const nameRaw = String(row["Product/Service"] ?? "").trim();
      if (!nameRaw) continue;
      const name = nameRaw.replace(/\s+/g, " ");
      const normalizedName = normalizeName(name);
      const basePrice = Number(row["Sales Price"] ?? row["Base Price"] ?? 0);
      const qty = Number(row["Qty"] ?? row["Quantity"] ?? 0);
      const bottle = await prisma.bottle.upsert({
        where: { normalizedName },
        create: { name, normalizedName },
        update: { name }
      });
      await prisma.inventory.upsert({
        where: { bottleId: bottle.id },
        create: { bottleId: bottle.id, basePrice, qtyAvailable: qty },
        update: { basePrice, qtyAvailable: qty }
      });
      imported += 1;
    }
  }
  return { imported };
}
