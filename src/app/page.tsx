import { BoardCard, type Board } from "@/components/BoardCard";
import { FoamieArt } from "@/components/FoamieArt";
import { site } from "@/lib/site";

// Pretend boards so the page doesn't look empty. Real listings come in a later step.
const sampleBoards: Board[] = [
  { name: "Big Blue", blurb: "A few dings, loves small days.", readyToRide: true, lengthFt: 8, town: "Huntington Beach", daysListed: 3, color: "#3b82c4" },
  { name: "Sunny", blurb: "Perfect first board for a kid.", readyToRide: true, lengthFt: 7, town: "Costa Mesa", daysListed: 1, color: "#f2c94c" },
  { name: "Old Red", blurb: "Snapped tail. Great foam for a shaper.", readyToRide: false, lengthFt: 9, town: "San Clemente", daysListed: 12, color: "#e5674e" },
];

const values = [
  { title: "Keep foam in the water.", text: "Every foamie that exists should get surfed before a new one gets made." },
  { title: "Free, always.", text: "No fees, no deposits, no catch." },
  { title: "Every board has a story.", text: "Boards get a name and a profile, like a rescue pup." },
];

export default function Home() {
  return (
    <>
      <section className="bg-sand">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-16 sm:flex-row">
          <div className="flex-1">
            <p className="font-bold text-sun-dark">{site.tagline}</p>
            <h1 className="mt-2 text-4xl font-extrabold leading-tight text-sea-dark sm:text-5xl">
              Adopt a foamie.
              <br />
              Free, forever.
            </h1>
            <p className="mt-4 max-w-md text-lg text-gray-700">
              Before you buy one, adopt one. Local boards in {site.area} are waiting for a new home.
            </p>
            <a
              href="#waiting"
              className="mt-8 inline-block rounded-full bg-sun px-8 py-3 text-lg font-bold text-white hover:bg-sun-dark"
            >
              See who&apos;s waiting…
            </a>
          </div>
          <div className="flex gap-2">
            <FoamieArt color="#3b82c4" className="h-56 -rotate-6" />
            <FoamieArt color="#f2c94c" className="h-48 rotate-6" />
          </div>
        </div>
      </section>

      <section id="waiting" className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-3xl font-extrabold text-sea-dark">Boards waiting for a home</h2>
        <p className="mt-1 text-gray-600">These are pretend boards for now.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sampleBoards.map((board) => (
            <BoardCard key={board.name} board={board} />
          ))}
        </div>
      </section>

      <section className="bg-sea text-white">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-14 sm:grid-cols-3">
          {values.map((v) => (
            <div key={v.title}>
              <h3 className="text-xl font-extrabold">{v.title}</h3>
              <p className="mt-2 text-white/80">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 text-center">
        <h2 className="text-3xl font-extrabold text-sea-dark">Got a foamie in the garage?</h2>
        <p className="mt-2 text-gray-600">Give it a second life. It takes a photo and a minute.</p>
        <button
          type="button"
          disabled
          title="Coming soon"
          className="mt-6 rounded-full border-2 border-sun px-8 py-3 font-bold text-sun-dark opacity-60"
        >
          List a board (coming soon)
        </button>
      </section>
    </>
  );
}
