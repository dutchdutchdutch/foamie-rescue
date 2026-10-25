import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AccountLinks } from "@/components/AccountLinks";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: `${site.name}: free foamie adoption`,
  description: "Adopt a foamie. Free, forever.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col font-sans">
        <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 backdrop-blur">
          <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="text-xl font-extrabold tracking-tight text-sea">
              {site.name}
            </Link>
            <div className="flex items-center gap-1 text-sm font-bold sm:gap-3">
              <Link href="/boards" className="rounded-full px-3 py-2 text-sea-dark hover:bg-sand">
                Adopt
              </Link>
              <Link href="/give" className="rounded-full px-3 py-2 text-sea-dark hover:bg-sand">
                Give a board
              </Link>
              <Link href="/inbox" className="rounded-full px-3 py-2 text-sea-dark hover:bg-sand" title="Pretend inbox">
                <span aria-hidden="true">📬</span>
                <span className="sr-only">Pretend inbox</span>
              </Link>
              <Suspense>
                <AccountLinks />
              </Suspense>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-sand">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-gray-600 sm:flex-row sm:justify-between">
            <p>
              <span className="font-bold text-sea-dark">{site.name}</span> · {site.tagline}
            </p>
            <p>
              Free, always. No fees, no deposits, no catch. Starting in {site.area}. ·{" "}
              <Link href="/admin" className="underline hover:text-sea-dark">
                Behind the scenes
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
