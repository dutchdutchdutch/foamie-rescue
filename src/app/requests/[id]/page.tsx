import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { BoardPicture } from "@/components/BoardPicture";
import { currentPerson } from "@/lib/auth";
import { getBoard } from "@/lib/boards";
import { contactOf, getRequest, whenText } from "@/lib/requests";
import { answerAction, giverReportAction } from "../actions";
import { TakerReport } from "./TakerReport";

export default function RequestPage(props: PageProps<"/requests/[id]">) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-sand" />}>
        <RequestView params={props.params} />
      </Suspense>
    </section>
  );
}

async function RequestView({ params }: Pick<PageProps<"/requests/[id]">, "params">) {
  const { id } = await params;
  const person = await currentPerson();
  if (!person) redirect(`/signin?next=${encodeURIComponent(`/requests/${id}`)}`);
  const req = getRequest(Number(id));
  const board = req ? getBoard(req.boardId) : null;
  if (!req || !board) notFound();

  const isGiver = board.ownerId === person.id;
  const isTaker = req.takerId === person.id;
  if (!isGiver && !isTaker) {
    return <p className="rounded-3xl bg-sand p-8 text-center text-gray-700">This ask belongs to someone else.</p>;
  }
  const giverContact = board.ownerId ? contactOf(board.ownerId) : null;

  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href={`/boards/${board.id}`}
          className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-sand"
        >
          <BoardPicture board={board} />
        </Link>
        <div>
          <p className="text-sm font-bold text-gray-500">{isGiver ? "Someone asked for your board" : "Your ask"}</p>
          <h1 className="text-3xl font-extrabold text-sea-dark">{board.name}</h1>
        </div>
      </div>

      <dl className="mt-8 flex flex-col gap-3 rounded-3xl border border-gray-100 p-6 shadow-sm">
        <Row label="When">{whenText(req)}</Row>
        {req.note && <Row label="Note">&ldquo;{req.note}&rdquo;</Row>}
        <Row label="Answer">
          {req.status === "waiting" ? "Waiting for the owner" : req.status === "yes" ? "Yes! 🎉" : "Not this time"}
        </Row>
      </dl>

      {isGiver && req.status === "waiting" && (
        <div className="mt-8">
          <p className="font-bold text-sea-dark">Can they have {board.name}?</p>
          <p className="mt-1 text-sm text-gray-600">
            If you say yes, you both get each other&apos;s phone or email. You can say yes to more than one person;
            whoever shows up first gets the board.
          </p>
          <div className="mt-4 flex gap-3">
            <form action={answerAction}>
              <input type="hidden" name="requestId" value={req.id} />
              <button name="answer" value="yes" className="rounded-full bg-kelp px-8 py-3 text-lg font-bold text-white hover:opacity-90">
                Yes
              </button>
            </form>
            <form action={answerAction}>
              <input type="hidden" name="requestId" value={req.id} />
              <button name="answer" value="no" className="rounded-full border-2 border-gray-300 px-8 py-3 text-lg font-bold text-gray-700 hover:border-gray-400">
                No
              </button>
            </form>
          </div>
        </div>
      )}

      {req.status === "yes" && (
        <div className="mt-8 rounded-3xl bg-kelp p-6 text-white">
          <p className="text-lg font-extrabold">You&apos;re matched!</p>
          <p className="mt-1">
            {isGiver ? "Reach the person picking it up at " : "Reach the owner at "}
            <strong>{isGiver ? req.takerContact : giverContact}</strong> to agree on the exact spot and time.
          </p>
          {isTaker && <p className="mt-2 text-sm text-white/85">The owner may say yes to others too. First to show up gets it.</p>}
        </div>
      )}

      {/* After a yes: did it find a home? */}
      {isTaker && req.status === "yes" && !req.takerReported && (board.status === "listed" || req.handoff === "done") && (
        <TakerReport requestId={req.id} boardName={board.name} />
      )}
      {isGiver && req.status === "yes" && req.handoff === null && board.status === "listed" && (
        <div className="mt-8 rounded-3xl bg-sand p-6">
          <p className="text-lg font-extrabold text-sea-dark">Did {board.name} find a home with them?</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <form action={giverReportAction}>
              <input type="hidden" name="requestId" value={req.id} />
              <button name="happened" value="yes" className="rounded-full bg-kelp px-6 py-2.5 font-bold text-white hover:opacity-90">
                Yes, they picked it up
              </button>
            </form>
            <form action={giverReportAction}>
              <input type="hidden" name="requestId" value={req.id} />
              <button name="happened" value="no" className="rounded-full border-2 border-gray-300 px-6 py-2.5 font-bold text-gray-700 hover:border-gray-400">
                No, it didn&apos;t happen
              </button>
            </form>
          </div>
        </div>
      )}
      {req.handoff === "done" && (
        <div className="mt-8 rounded-3xl bg-sea p-6 text-white">
          <p className="text-lg font-extrabold">🎉 {board.name} found a home!</p>
          {req.takerPhoto && (
            // eslint-disable-next-line @next/next/no-img-element -- local photo
            <img src={`/photos/${req.takerPhoto}`} alt={`${board.name} with its new owner`} className="mt-4 max-h-80 rounded-2xl" />
          )}
        </div>
      )}
      {req.handoff === "failed" && <p className="mt-8 rounded-3xl bg-sand p-6 text-gray-700">This pickup didn&apos;t happen.</p>}

      {isTaker && req.status === "no" && (
        <p className="mt-8 rounded-3xl bg-sand p-6 text-gray-700">
          The owner can&apos;t make it work this time.{" "}
          <Link href="/boards" className="font-bold text-cta hover:underline">
            See other boards →
          </Link>
        </p>
      )}

      <Link href="/mine" className="mt-8 inline-block text-sm font-bold text-sea hover:underline">
        See all my boards and asks →
      </Link>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <dt className="w-20 shrink-0 font-bold text-sea-dark">{label}</dt>
      <dd className="text-gray-700">{children}</dd>
    </div>
  );
}
