import { prisma } from "@/lib/prisma";
import { visiblePrice } from "@/lib/pricing";

export async function getCatalog(query?: string) {
  const bottles = await prisma.bottle.findMany({ include: { inventory: true }, orderBy: { name: "asc" } });
  const q = query?.toLowerCase().trim();
  return bottles
    .filter((b) => (!q ? true : b.name.toLowerCase().includes(q)))
    .map((b) => {
      const qty = b.inventory?.qtyAvailable;
      const status = b.inventory ? (qty && qty > 0 ? "In Stock" : "Out of Stock") : "Not Currently Carried";
      return { ...b, status, shownPrice: visiblePrice({ qtyAvailable: qty ?? null, basePrice: b.inventory?.basePrice ? Number(b.inventory.basePrice) : null }) };
    });
}

export async function getBottle(id: string, userId?: string) {
  const bottle = await prisma.bottle.findUnique({ where: { id }, include: { inventory: true } });
  if (!bottle) return null;
  const cp = userId
    ? await prisma.clientPrice.findUnique({ where: { userId_bottleId: { userId, bottleId: id } } })
    : null;
  return {
    ...bottle,
    shownPrice: visiblePrice({
      qtyAvailable: bottle.inventory?.qtyAvailable,
      clientPrice: cp ? Number(cp.price) : null,
      basePrice: bottle.inventory?.basePrice ? Number(bottle.inventory.basePrice) : null
    })
  };
}
