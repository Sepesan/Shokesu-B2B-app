import Link from "next/link";
import { getCatalog } from "@/lib/catalog";

export default async function CatalogPage({ searchParams }: { searchParams: { q?: string } }) {
  const items = await getCatalog(searchParams.q);
  return (
    <div>
      <h1>Bottle Catalog</h1>
      <form>
        <input name="q" defaultValue={searchParams.q} placeholder="Search" />
        <button>Search</button>
      </form>
      <div className="grid">
        {items.map((item) => (
          <div className="card" key={item.id}>
            <h3><Link href={`/bottle/${item.id}`}>{item.name}</Link></h3>
            <span className={`badge ${item.status === 'In Stock' ? 'stock' : item.status === 'Out of Stock' ? 'oos' : 'nc'}`}>{item.status}</span>
            {item.shownPrice ? <p>${item.shownPrice.toFixed(2)}</p> : <p>Price hidden</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
