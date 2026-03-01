import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET() {
  await requireAdmin();
  const orders = await prisma.order.findMany({ where: { status: "APPROVED" }, include: { user: true, items: { include: { bottle: true } } } });
  const lines = ["client_name,client_email,bottle_name,qty,unit_price,line_total"];
  for (const order of orders) {
    for (const item of order.items) {
      const unit = Number(item.unitPrice);
      lines.push(`${order.user.name ?? ""},${order.user.email},${item.bottle.name},${item.qty},${unit.toFixed(2)},${(unit * item.qty).toFixed(2)}`);
    }
    await prisma.order.update({ where: { id: order.id }, data: { status: "EXPORTED", exportedAt: new Date() } });
  }
  return new Response(lines.join("\n"), { headers: { "content-type": "text/csv", "content-disposition": "attachment; filename=orders.csv" } });
}
