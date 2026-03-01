import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBottle } from "@/lib/catalog";
import { notFound } from "next/navigation";

export default async function BottlePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const bottle = await getBottle(params.id, session?.user.id);
  if (!bottle) return notFound();
  const inStock = (bottle.inventory?.qtyAvailable ?? 0) > 0;
  return (
    <div>
      <h1>{bottle.name}</h1>
      {bottle.imageUrl && <img src={bottle.imageUrl} alt={bottle.name} width={260} />}
      <p>{bottle.description}</p>
      <div className="grid">{bottle.galleryImages.map((img) => <img key={img} src={img} alt="gallery" width={220} />)}</div>
      {inStock ? (
        <>
          <p>Price: ${bottle.shownPrice?.toFixed(2)}</p>
          <form action="/api/requests" method="post">
            <input type="hidden" name="bottleId" value={bottle.id} />
            <input type="number" min={1} name="qty" defaultValue={1} />
            <button>Add to Request</button>
          </form>
        </>
      ) : (
        <>
          <p>Out of stock. Price hidden.</p>
          <form action="/api/notify" method="post">
            <input type="hidden" name="bottleId" value={bottle.id} />
            <button>Notify me if available</button>
          </form>
        </>
      )}
    </div>
  );
}
