import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: `${site.name}: free foamie adoption`,
  description: "Adopt a foamie. Free, forever.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <header className="border-b border-gray-100">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-xl font-extrabold tracking-tight text-sea">
              {site.name}
            </Link>
            <span className="hidden text-sm text-gray-500 sm:block">{site.tagline}</span>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-sand">
          <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-gray-600">
            Free, always. No fees, no deposits, no catch. Starting in {site.area}.
          </div>
        </footer>
      </body>
    </html>
  );
}
