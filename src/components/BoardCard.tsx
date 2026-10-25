import { FoamieArt } from "./FoamieArt";

export type Board = {
  name: string;
  blurb: string;
  readyToRide: boolean;
  lengthFt: number;
  town: string;
  daysListed: number;
  color: string;
};

export function BoardCard({ board }: { board: Board }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="relative flex h-56 items-center justify-center bg-sand">
        <FoamieArt color={board.color} className="h-48 -rotate-12" />
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
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
          <li className="whitespace-nowrap">📏 {board.lengthFt} ft</li>
          <li className="whitespace-nowrap">📍 {board.town}</li>
          <li className="whitespace-nowrap">🗓️ {board.daysListed} {board.daysListed === 1 ? "day" : "days"}</li>
        </ul>
        <button
          type="button"
          disabled
          title="Coming soon"
          className="mt-auto rounded-full bg-sun px-4 py-2 font-bold text-white opacity-60"
        >
          I&apos;d like this board
        </button>
      </div>
    </article>
  );
}
