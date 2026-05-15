import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chem3 Titration Lab",
  description: "Interactive vinegar titration grounded in Tro's General Chemistry.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="border-b border-slate-200 dark:border-slate-800">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-semibold">
              Chem3 Titration Lab
            </Link>
            <ul className="flex gap-6 text-sm">
              <li>
                <Link href="/lab" className="hover:underline">
                  Lab
                </Link>
              </li>
              <li>
                <Link href="/game" className="hover:underline">
                  Sandbox
                </Link>
              </li>
              <li>
                <Link href="/theory" className="hover:underline">
                  Theory
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
