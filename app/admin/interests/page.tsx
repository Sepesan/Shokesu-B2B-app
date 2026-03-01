import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export default async function InterestsAdminPage() {
  await requireAdmin();
  const bottles = await prisma.bottle.findMany({ include: { interests: { include: { user: true } } } });
  return (
    <div>
      <h1>Interest Demand</h1>
      {bottles.filter((b) => b.interests.length).map((b) => (
        <div key={b.id} className="card">
          <h3>{b.name}</h3>
          <form action="/api/admin/notify" method="post">
            <input type="hidden" name="bottleId" value={b.id} />
            {b.interests.map((i) => (
              <label key={i.id}><input type="checkbox" name="userId" value={i.userId} /> {i.user.email}</label>
            ))}
            <button>Send availability email</button>
          </form>
        </div>
      ))}
    </div>
  );
}
