import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export default async function InvitesPage() {
  await requireAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <h1>Invite / Revoke Users</h1>
      <form action="/api/admin/invites" method="post">
        <input name="email" type="email" placeholder="client@email.com" required />
        <button>Invite</button>
      </form>
      <ul>{users.map((u)=><li key={u.id}>{u.email} - invited:{String(u.invited)} - revoked:{String(u.revoked)}</li>)}</ul>
    </div>
  );
}
