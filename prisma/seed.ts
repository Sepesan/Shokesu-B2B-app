import { prisma } from "../lib/prisma";
import { normalizeName } from "../lib/normalize";

async function main() {
  await prisma.user.upsert({ where: { email: "admin@shokesu.com" }, create: { email: "admin@shokesu.com", role: "ADMIN", invited: true }, update: { role: "ADMIN", invited: true, revoked: false } });
  const b = await prisma.bottle.upsert({ where: { normalizedName: normalizeName("Sample Junmai") }, create: { name: "Sample Junmai", normalizedName: normalizeName("Sample Junmai"), description: "Seed bottle" }, update: {} });
  await prisma.inventory.upsert({ where: { bottleId: b.id }, create: { bottleId: b.id, qtyAvailable: 12, basePrice: 35 }, update: {} });
}

main().finally(() => prisma.$disconnect());
