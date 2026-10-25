import { boardAction } from "@/app/mine/actions";
import { isExpired, isOpen, type Board } from "@/lib/boards";

// Relist and "it's gone" buttons for a board's owner.
export function OwnerButtons({ board, back }: { board: Board; back: "mine" | "board" }) {
  if (board.status === "adopted") return null;
  const relistLabel = isExpired(board) || board.status === "gone" ? "Relist it" : "Relist for 30 more days";
  return (
    <div className="flex flex-wrap gap-2">
      <form action={boardAction}>
        <input type="hidden" name="boardId" value={board.id} />
        <input type="hidden" name="back" value={back} />
        <button name="do" value="relist" className="rounded-full bg-sea px-4 py-1.5 text-sm font-bold text-white hover:bg-sea-dark">
          {relistLabel}
        </button>
      </form>
      {isOpen(board) || isExpired(board) ? (
        <form action={boardAction}>
          <input type="hidden" name="boardId" value={board.id} />
          <input type="hidden" name="back" value={back} />
          <button name="do" value="gone" className="rounded-full border-2 border-gray-300 px-4 py-1.5 text-sm font-bold text-gray-700 hover:border-gray-400">
            It&apos;s gone
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function statusLabel(board: Board) {
  if (board.status === "adopted") return "Found a home 🎉";
  if (board.status === "gone") return "Taken down";
  if (isExpired(board)) return "Ran out (not shown)";
  return "Listed";
}
