import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { BoardCard } from "@/components/BoardCard";
import { BoardGridSkeleton } from "@/components/BoardGridSkeleton";
import { FoamieArt } from "@/components/FoamieArt";
import { listBoards } from "@/lib/boards";
import { site } from "@/lib/site";

const steps = [
  { icon: "🔎", title: "Find a board", text: `Browse foamies near you in ${site.area}. Each one has a name and a photo.` },
  { icon: "🙋", title: "Ask for it", text: "Tap “I'd like this board” and say when you can pick it up. The owner says yes or no." },
  { icon: "🏄", title: "Pick it up and surf", text: "Once you both say yes, you swap contact info and meet up. Free, no catch." },
];

const values = [
  { title: "Keep foam in the water.", text: "Every foamie that exists should get surfed before a new one gets made." },
  { title: "Free, always.", text: "No fees, no deposits, no catch." },
  { title: "Every board has a story.", text: "Boards get a name and a profile, like a rescue pup." },
];

const giveSteps = ["Snap a photo", "Add your town or zip (never your address)", "Say if it's ready to ride"];

export default function Home() {
  return (
    <>
      {/* 1. Hero: lead with the free pickup. Givers get a quieter second link. */}
      <section className="bg-sand">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-4 py-14 sm:flex-row sm:py-20">
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
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href="#waiting"
                className="inline-block rounded-full bg-cta px-8 py-3 text-lg font-bold text-white hover:bg-cta-dark"
              >
                See who&apos;s waiting…
              </Link>
              <Link href="#give" className="font-bold text-sea underline-offset-4 hover:underline">
                Got one to give? →
              </Link>
            </div>
          </div>
          <div className="hidden gap-2 sm:flex">
            <FoamieArt color="#3b82c4" className="h-56 -rotate-6" />
            <FoamieArt color="#f2c94c" className="h-48 rotate-6" />
          </div>
        </div>
      </section>

      {/* 2. The boards. */}
      <section id="waiting" className="mx-auto max-w-5xl scroll-mt-16 px-4 py-14">
        <h2 className="text-3xl font-extrabold text-sea-dark">Boards waiting for a home</h2>
        <p className="mt-1 text-gray-600">The newest boards near you.</p>
        <Suspense fallback={<BoardGridSkeleton count={3} />}>
          <NewestBoards />
        </Suspense>
        <Link href="/boards" className="mt-8 inline-block font-bold text-cta hover:underline">
          See all boards →
        </Link>
      </section>

      {/* 3. How it works, so a first-time visitor knows what happens after they click. */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-3xl font-extrabold text-sea-dark">How adopting works</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-3xl bg-sand p-6">
                <p className="text-3xl" aria-hidden="true">{s.icon}</p>
                <h3 className="mt-3 text-lg font-extrabold text-sea">
                  {i + 1}. {s.title}
                </h3>
                <p className="mt-1 text-gray-700">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Why we do it. */}
      <section className="bg-sea text-white">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-14 sm:grid-cols-3">
          {values.map((v) => (
            <div key={v.title}>
              <h3 className="text-xl font-extrabold">{v.title}</h3>
              <p className="mt-2 text-white/85">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Givers. Make it feel quick and good. */}
      <section id="give" className="mx-auto max-w-5xl scroll-mt-16 px-4 py-16 text-center">
        <h2 className="text-3xl font-extrabold text-sea-dark">Got a foamie in the garage?</h2>
        <p className="mx-auto mt-2 max-w-lg text-gray-600">
          Give it a second life and keep a new one from being made. It takes a minute.
        </p>
        <ul className="mt-6 flex flex-col items-center justify-center gap-2 text-gray-700 sm:flex-row sm:gap-6">
          {giveSteps.map((g) => (
            <li key={g}>
              <span className="font-bold text-kelp" aria-hidden="true">✓</span> {g}
            </li>
          ))}
        </ul>
        <Link
          href="/give"
          className="mt-8 inline-block rounded-full bg-cta px-8 py-3 text-lg font-bold text-white hover:bg-cta-dark"
        >
          List a board
        </Link>
      </section>
    </>
  );
}

async function NewestBoards() {
  await connection(); // read fresh boards on every visit
  const boards = listBoards("all", 3);
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {boards.map((board) => (
        <BoardCard key={board.id} board={board} />
      ))}
    </div>
  );
}
