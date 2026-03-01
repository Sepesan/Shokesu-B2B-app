import { Prisma, RequestStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { visiblePrice } from "@/lib/pricing";

export async function approveRequest(requestId: string) {
  return prisma.$transaction(async (tx) => {
    const request = await tx.request.findUnique({ where: { id: requestId }, include: { items: true, user: true } });
    if (!request) throw new Error("Request not found");
    if (request.status !== RequestStatus.PENDING) throw new Error("Request not pending");

    const orderItems: { bottleId: string; qty: number; unitPrice: Prisma.Decimal }[] = [];
    for (const item of request.items) {
      const inv = await tx.inventory.findUnique({ where: { bottleId: item.bottleId } });
      if (!inv || inv.qtyAvailable <= 0) continue;
      const cp = await tx.clientPrice.findUnique({ where: { userId_bottleId: { userId: request.userId, bottleId: item.bottleId } } });
      const price = visiblePrice({ qtyAvailable: inv.qtyAvailable, clientPrice: cp ? Number(cp.price) : null, basePrice: inv.basePrice ? Number(inv.basePrice) : null });
      if (!price) continue;
      const allocate = Math.max(0, Math.min(item.qtyAllocated ?? item.qtyRequested, inv.qtyAvailable));
      if (allocate === 0) continue;
      await tx.inventory.update({ where: { bottleId: item.bottleId }, data: { qtyAvailable: { decrement: allocate } } });
      orderItems.push({ bottleId: item.bottleId, qty: allocate, unitPrice: new Prisma.Decimal(price) });
    }

    await tx.request.update({ where: { id: requestId }, data: { status: RequestStatus.APPROVED } });
    if (orderItems.length) {
      await tx.order.create({ data: { requestId, userId: request.userId, items: { create: orderItems } } });
    }
  });
}
