import type { Board } from "@/lib/boards";
import { FoamieArt } from "./FoamieArt";

// The board's photo, or a drawing for example boards that don't have one.
export function BoardPicture({ board, className = "" }: { board: Board; className?: string }) {
  if (board.photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- local photos, no image service needed
      <img src={`/photos/${board.photo}`} alt={`Photo of ${board.name}`} className={`h-full w-full object-cover ${className}`} />
    );
  }
  return <FoamieArt color={board.color ?? "#3b82c4"} className={`h-[80%] rotate-[-60deg] ${className}`} />;
}
