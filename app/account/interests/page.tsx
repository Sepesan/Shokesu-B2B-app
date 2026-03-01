import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export default async function InterestsPage() {
  const user = await requireUser();
  const interests = await prisma.bottleInterest.findMany({ where: { userId: user.id, type: "NOTIFY" }, include: { bottle: true } });
  return (
    <div>
      <h1>Notify Me Interests</h1>
      <ul>
        {interests.map((i) => (
          <li key={i.id}>
            {i.bottle.name}
            <form action="/api/account/interests" method="post" style={{ display: "inline", marginLeft: 8 }}>
              <input type="hidden" name="interestId" value={i.id} />
              <button>Remove</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
