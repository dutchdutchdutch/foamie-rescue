import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { OwnerButtons, statusLabel } from "@/components/OwnerButtons";
import { currentPerson } from "@/lib/auth";
import { listBoardsByOwner } from "@/lib/boards";
import { requestsByTaker, requestsForBoard, whenText, type Status } from "@/lib/requests";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `My boards and asks · ${site.name}` };

const statusText: Record<Status, string> = { waiting: "Waiting for an answer", yes: "Yes! 🎉", no: "Not this time" };

export default function MinePage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-extrabold text-sea-dark">My boards and asks</h1>
      <Suspense fallback={<div className="mt-8 h-64 animate-pulse rounded-3xl bg-sand" />}>
        <Mine />
      </Suspense>
    </section>
  );
}

async function Mine() {
  const person = await currentPerson();
  if (!person) redirect("/signin?next=/mine");
  const boards = listBoardsByOwner(person.id);
  const asks = requestsByTaker(person.id);

  return (
    <>
      <h2 className="mt-10 text-2xl font-extrabold text-sea-dark">Boards I&apos;m giving</h2>
      {boards.length === 0 ? (
        <p className="mt-3 text-gray-600">
          None yet.{" "}
          <Link href="/give" className="font-bold text-cta hover:underline">
            List a board →
          </Link>
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
          {boards.map((b) => {
            const reqs = requestsForBoard(b.id);
            return (
              <li key={b.id} className="rounded-3xl border border-gray-100 p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p>
                    <Link href={`/boards/${b.id}`} className="text-lg font-extrabold text-sea hover:underline">
                      {b.name}
                    </Link>{" "}
                    <span className="text-sm text-gray-600">· {statusLabel(b)}</span>
                  </p>
                  <OwnerButtons board={b} back="mine" />
                </div>
                {reqs.length === 0 ? (
                  <p className="mt-1 text-sm text-gray-600">Nobody has asked yet.</p>
                ) : (
                  <ul className="mt-2 flex flex-col gap-1 text-sm">
                    {reqs.map((r) => (
                      <li key={r.id}>
                        <Link href={`/requests/${r.id}`} className="text-gray-700 hover:underline">
                          Ask for {whenText(r)} · <strong>{statusText[r.status]}</strong>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="mt-10 text-2xl font-extrabold text-sea-dark">Boards I asked for</h2>
      {asks.length === 0 ? (
        <p className="mt-3 text-gray-600">
          None yet.{" "}
          <Link href="/boards" className="font-bold text-cta hover:underline">
            Find a board →
          </Link>
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {asks.map((r) => (
            <li key={r.id}>
              <Link href={`/requests/${r.id}`} className="font-bold text-sea hover:underline">
                {r.board.name}
              </Link>{" "}
              · <span className="text-gray-700">{statusText[r.status]}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
