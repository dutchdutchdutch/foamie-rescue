import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Fact } from "@/components/BoardCard";
import { BoardPicture } from "@/components/BoardPicture";
import { ReadyBadge } from "@/components/ReadyBadge";
import { OwnerButtons } from "@/components/OwnerButtons";
import { currentPerson } from "@/lib/auth";
import { daysListed, getBoard, isExpired, type Board } from "@/lib/boards";
import { findRequest, requestsForBoard } from "@/lib/requests";

export default function BoardPage(props: PageProps<"/boards/[id]">) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/boards" className="text-sm font-bold text-sea hover:underline">
        ← All boards
      </Link>
      <Suspense fallback={<div className="mt-6 h-96 animate-pulse rounded-3xl bg-sand" />}>
        <BoardProfile params={props.params} searchParams={props.searchParams} />
      </Suspense>
    </section>
  );
}

async function BoardProfile({
  params,
  searchParams,
}: Pick<PageProps<"/boards/[id]">, "params" | "searchParams">) {
  await connection();
  const { id } = await params;
  const board = getBoard(id);
  if (!board) notFound();
  const justListed = (await searchParams).new === "1";
  const days = daysListed(board);

  return (
    <>
      {justListed && (
        <div role="status" className="mt-6 rounded-3xl bg-kelp p-5 text-white">
          <p className="text-lg font-extrabold">🎉 {board.name} is listed!</p>
          <p className="text-white/90">Thanks for giving a foamie a second life. This is what people will see.</p>
        </div>
      )}
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-sand">
          <BoardPicture board={board} />
        </div>
        <div className="flex flex-col gap-4">
          {board.status === "adopted" ? (
            <span className="self-start rounded-full bg-sea px-3 py-1 text-xs font-bold text-white">Rescued 🎉</span>
          ) : (
            <ReadyBadge ready={board.readyToRide} className="self-start" />
          )}
          <h1 className="text-4xl font-extrabold text-sea-dark">Meet {board.name}!</h1>
          {board.blurb && <p className="text-lg text-gray-700">{board.blurb}</p>}
          <ul className="flex flex-col gap-2 text-gray-700">
            {board.lengthFt && <Fact icon="📏" label="Length">{board.lengthFt} ft</Fact>}
            {board.brand && <Fact icon="🏷️" label="Brand">{board.brand}</Fact>}
            <Fact icon="📍" label="Where">
              {board.town}
              {board.zip ? ` (${board.zip})` : ""}
            </Fact>
            {board.status === "listed" && (
              <Fact icon="🗓️" label="Listed">
                {days === 0 ? "Listed today" : `Listed ${days} ${days === 1 ? "day" : "days"} ago`}
              </Fact>
            )}
          </ul>
          <p className="rounded-2xl bg-sand p-4 text-sm text-gray-700">
            {board.readyToRide
              ? "Ready to surf as it is. When it's done, the foam can still be reused by a shaper."
              : "Not ready to surf as it is. Great for fixing up, or for a shaper to reuse the foam."}
          </p>
          {board.isExample && <p className="text-sm text-gray-500">This is an example board, not a real one.</p>}
          <AskArea board={board} />
        </div>
      </div>
    </>
  );
}

// The "I'd like this board" button, or what to show instead.
async function AskArea({ board }: { board: Board }) {
  if (board.status === "adopted") {
    return <p className="mt-2 text-lg font-extrabold text-sea-dark">{board.name} found a home! 🎉</p>;
  }
  if (board.isExample) {
    return <p className="mt-2 text-sm text-gray-500">Example boards can&apos;t be asked for. List a real one to try it out!</p>;
  }
  const person = await currentPerson();
  const askLink = `/boards/${board.id}/ask`;
  const button = "mt-2 self-start rounded-full bg-cta px-8 py-3 text-lg font-bold text-white hover:bg-cta-dark";
  if (person && board.ownerId === person.id) {
    const count = requestsForBoard(board.id).length;
    return (
      <div className="mt-2 flex flex-col gap-3">
        {board.status === "gone" && <p className="font-bold text-gray-700">You took this listing down.</p>}
        {isExpired(board) && <p className="font-bold text-gray-700">This listing ran out, so it isn&apos;t shown anymore.</p>}
        <Link href="/mine" className="self-start font-bold text-sea hover:underline">
          This is your board · {count} {count === 1 ? "ask" : "asks"} so far →
        </Link>
        <OwnerButtons board={board} back="board" />
      </div>
    );
  }
  if (board.status !== "listed" || isExpired(board)) {
    return <p className="mt-2 font-bold text-gray-700">This board isn&apos;t up for adoption anymore.</p>;
  }
  if (!person) {
    return (
      <Link href={`/signin?next=${encodeURIComponent(askLink)}`} className={button}>
        I&apos;d like this board
      </Link>
    );
  }
  const existing = findRequest(board.id, person.id);
  if (existing) {
    return (
      <Link href={`/requests/${existing.id}`} className="mt-2 self-start font-bold text-sea hover:underline">
        You asked for {board.name} · see the answer →
      </Link>
    );
  }
  return (
    <Link href={askLink} className={button}>
      I&apos;d like this board
    </Link>
  );
}
