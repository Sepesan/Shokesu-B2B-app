import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export default async function OrdersPage() {
  await requireAdmin();
  const orders = await prisma.order.findMany({ include: { user: true, items: { include: { bottle: true } } } });
  return (
    <div>
      <h1>Orders</h1>
      <a href="/api/admin/orders-export">Export CSV</a>
      {orders.map((o) => (
        <div key={o.id} className="card">
          <h3>{o.user.email} ({o.status})</h3>
          <ul>{o.items.map((i) => <li key={i.id}>{i.bottle.name} x{i.qty} @ ${Number(i.unitPrice).toFixed(2)}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}
