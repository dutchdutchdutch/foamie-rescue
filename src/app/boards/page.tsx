import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { BoardCard } from "@/components/BoardCard";
import { BoardGridSkeleton } from "@/components/BoardGridSkeleton";
import { listBoards, type BoardFilter } from "@/lib/boards";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `Boards waiting for a home · ${site.name}` };

const filters: { value: BoardFilter; label: string }[] = [
  { value: "all", label: "All boards" },
  { value: "ready", label: "Ready to ride" },
  { value: "love", label: "Needs some love" },
];

export default function BoardsPage(props: PageProps<"/boards">) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-4xl font-extrabold text-sea-dark">Boards waiting for a home</h1>
      <p className="mt-2 text-gray-600">
        Every board here is free. &ldquo;Needs some love&rdquo; boards are great for fixing up or for shapers to
        reuse the foam.
      </p>
      <Suspense fallback={<BoardGridSkeleton count={6} />}>
        <FilteredBoards searchParams={props.searchParams} />
      </Suspense>
    </section>
  );
}

async function FilteredBoards({ searchParams }: { searchParams: PageProps<"/boards">["searchParams"] }) {
  await connection();
  const raw = (await searchParams).show;
  const current: BoardFilter = raw === "ready" || raw === "love" ? raw : "all";
  const boards = listBoards(current);
  return (
    <>
      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Filter boards">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/boards" : `/boards?show=${f.value}`}
            aria-current={f.value === current ? "page" : undefined}
            className={`rounded-full border-2 px-4 py-1.5 text-sm font-bold ${
              f.value === current ? "border-sea bg-sea text-white" : "border-gray-200 text-sea-dark hover:border-sea"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </nav>
      {boards.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-sand p-10 text-center">
          <p className="text-lg font-bold text-sea-dark">No boards here right now.</p>
          <p className="mt-1 text-gray-600">Check back soon, or list one of your own.</p>
          <Link href="/give" className="mt-4 inline-block font-bold text-cta hover:underline">
            List a board →
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      )}
    </>
  );
}
