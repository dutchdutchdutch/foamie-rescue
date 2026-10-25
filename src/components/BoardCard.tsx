import Link from "next/link";
import { daysListed, type Board } from "@/lib/boards";
import { BoardPicture } from "./BoardPicture";
import { ReadyBadge } from "./ReadyBadge";

export function BoardCard({ board }: { board: Board }) {
  const days = daysListed(board);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-sand sm:h-56">
        <BoardPicture board={board} />
        <ReadyBadge ready={board.readyToRide} className="absolute left-4 top-4" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-xl font-extrabold text-sea">
          <Link href={`/boards/${board.id}`} className="after:absolute after:inset-0">
            Meet {board.name}!
          </Link>
        </h3>
        {board.blurb && <p className="line-clamp-2 text-gray-600">{board.blurb}</p>}
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          {board.lengthFt && <Fact icon="📏" label="Length">{board.lengthFt} ft</Fact>}
          <Fact icon="📍" label="Town">{board.town}</Fact>
          <Fact icon="🗓️" label="Listed">
            {days === 0 ? "today" : `${days} ${days === 1 ? "day" : "days"} ago`}
          </Fact>
        </ul>
        <span className="mt-auto pt-1 font-bold text-cta group-hover:underline">See {board.name}&apos;s profile →</span>
      </div>
    </article>
  );
}

// The emoji is decoration; screen readers hear the label instead.
export function Fact({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <li className="whitespace-nowrap">
      <span aria-hidden="true">{icon}</span> <span className="sr-only">{label}: </span>
      {children}
    </li>
  );
}
