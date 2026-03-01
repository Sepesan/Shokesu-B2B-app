import Link from "next/link";
import "./styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="nav">
          <Link href="/catalog">Catalog</Link>
          <Link href="/account/interests">My Notifications</Link>
          <Link href="/admin/requests">Admin</Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
