import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { BoardPicture } from "@/components/BoardPicture";
import { currentPerson } from "@/lib/auth";
import { getBoard, isOpen } from "@/lib/boards";
import { findRequest, soonOptions, windowOptions } from "@/lib/requests";
import { AskForm } from "./AskForm";

export default function AskPage(props: PageProps<"/boards/[id]/ask">) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-sand" />}>
        <Ask params={props.params} />
      </Suspense>
    </section>
  );
}

async function Ask({ params }: Pick<PageProps<"/boards/[id]/ask">, "params">) {
  const { id } = await params;
  const board = getBoard(id);
  if (!board) notFound();
  const person = await currentPerson();
  if (!person) redirect(`/signin?next=${encodeURIComponent(`/boards/${id}/ask`)}`);
  if (board.ownerId === null || board.ownerId === person.id || !isOpen(board)) redirect(`/boards/${id}`);
  const existing = findRequest(board.id, person.id);
  if (existing) redirect(`/requests/${existing.id}`);

  return (
    <>
      <Link href={`/boards/${board.id}`} className="text-sm font-bold text-sea hover:underline">
        ← Back to {board.name}
      </Link>
      <div className="mt-6 flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-sand">
          <BoardPicture board={board} />
        </div>
        <h1 className="text-3xl font-extrabold text-sea-dark sm:text-4xl">You&apos;d like {board.name}!</h1>
      </div>
      <p className="mt-4 text-lg text-gray-700">
        Tell the owner when you could pick it up. If they say yes, you&apos;ll both get each other&apos;s phone or email
        to agree on the exact spot.
      </p>
      <AskForm boardId={board.id} soonOptions={soonOptions} windowOptions={windowOptions} />
    </>
  );
}
