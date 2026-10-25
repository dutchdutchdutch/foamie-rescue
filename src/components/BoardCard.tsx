import type { Board } from "@/lib/boards";
import { FoamieArt } from "./FoamieArt";
import { SoonButton } from "./SoonButton";

export function BoardCard({ board }: { board: Board }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="relative flex h-40 items-center justify-center bg-sand sm:h-52">
        <FoamieArt color={board.color} className="h-32 rotate-[-60deg] sm:h-44" />
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold text-white ${
            board.readyToRide ? "bg-kelp" : "bg-coral"
          }`}
        >
          {board.readyToRide ? "Ready to ride" : "Needs some love"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-xl font-extrabold text-sea">Meet {board.name}!</h3>
        <p className="text-gray-600">{board.blurb}</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          <Fact icon="📏" label="Length">{board.lengthFt} ft</Fact>
          <Fact icon="📍" label="Town">{board.town}</Fact>
          <Fact icon="🗓️" label="Listed for">
            {board.daysListed} {board.daysListed === 1 ? "day" : "days"}
          </Fact>
        </ul>
        <SoonButton className="mt-auto text-sm">I&apos;d like this board</SoonButton>
      </div>
    </article>
  );
}

// The emoji is decoration; screen readers hear the label instead.
function Fact({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <li className="whitespace-nowrap">
      <span aria-hidden="true">{icon}</span> <span className="sr-only">{label}: </span>
      {children}
    </li>
  );
}
