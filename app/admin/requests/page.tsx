import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export default async function AdminRequestsPage() {
  await requireAdmin();
  const requests = await prisma.request.findMany({ where: { status: "PENDING" }, include: { user: true, items: { include: { bottle: true } } } });
  return (
    <div>
      <h1>Pending Requests</h1>
      {requests.map((r) => (
        <div className="card" key={r.id}>
          <h3>{r.user.email}</h3>
          <ul>{r.items.map((i) => <li key={i.id}>{i.bottle.name} - requested {i.qtyRequested}</li>)}</ul>
          <form action="/api/admin/requests" method="post">
            <input type="hidden" name="requestId" value={r.id} />
            <button name="action" value="APPROVE">Approve</button>
            <button name="action" value="DENY">Deny</button>
          </form>
        </div>
      ))}
    </div>
  );
}
