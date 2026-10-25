import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { expireDays, reminderDays } from "@/lib/boards";
import { impact } from "@/lib/checks";
import { clockOffsetDays, now } from "@/lib/clock";
import { site } from "@/lib/site";
import { moveClockAction, runChecksAction } from "./actions";

export const metadata: Metadata = { title: `Behind the scenes · ${site.name}` };

export default function AdminPage(props: PageProps<"/admin">) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-extrabold text-sea-dark">Behind the scenes</h1>
      <p className="mt-2 text-gray-700">Tools for running the site. Only you see this, on your Mac.</p>
      <Suspense fallback={<div className="mt-8 h-96 animate-pulse rounded-3xl bg-sand" />}>
        <Panels searchParams={props.searchParams} />
      </Suspense>
    </section>
  );
}

async function Panels({ searchParams }: Pick<PageProps<"/admin">, "searchParams">) {
  await connection();
  const params = await searchParams;
  const offset = clockOffsetDays();
  const { adopted, notBought } = impact();
  const card = "mt-8 rounded-3xl border border-gray-100 p-6 shadow-sm";

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Stat number={adopted} label={adopted === 1 ? "board found a home" : "boards found a home"} />
        <Stat number={notBought} label={notBought === 1 ? "new foamie not bought" : "new foamies not bought"} />
      </div>

      <div className={card}>
        <h2 className="text-xl font-extrabold text-sea-dark">Daily checks</h2>
        <p className="mt-1 text-gray-700">
          Sends the day-{reminderDays} reminders (&ldquo;Is your board still looking for a home?&rdquo;) and the
          &ldquo;Did it find a home?&rdquo; follow-ups a day after a yes. Nothing runs by itself; press the button
          once a day, or whenever you like. Messages go to the{" "}
          <Link href="/inbox" className="font-bold text-sea underline">
            pretend inbox
          </Link>
          .
        </p>
        {params.ran && (
          <p role="status" className="mt-4 rounded-2xl bg-kelp/10 p-4 font-bold text-kelp">
            Done: {String(params.reminders)} reminder(s) and {String(params.followUps)} follow-up(s) sent.
          </p>
        )}
        <form action={runChecksAction} className="mt-4">
          <button className="rounded-full bg-cta px-6 py-2.5 font-bold text-white hover:bg-cta-dark">Run daily checks</button>
        </form>
      </div>

      <div className={card}>
        <h2 className="text-xl font-extrabold text-sea-dark">Pretend clock</h2>
        <p className="mt-1 text-gray-700">
          Listings run out after {expireDays} days. To try that without waiting, move the site&apos;s clock forward.
        </p>
        <p className="mt-3 text-lg">
          The site thinks today is{" "}
          <strong>{now().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</strong>
          {offset > 0 && <span className="text-gray-600"> ({offset} {offset === 1 ? "day" : "days"} ahead)</span>}.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[1, 10, 20].map((d) => (
            <form key={d} action={moveClockAction}>
              <input type="hidden" name="days" value={d} />
              <button className="rounded-full border-2 border-sea px-4 py-2 font-bold text-sea hover:bg-sand">
                +{d} {d === 1 ? "day" : "days"}
              </button>
            </form>
          ))}
          {offset > 0 && (
            <form action={moveClockAction}>
              <input type="hidden" name="days" value={0} />
              <button className="rounded-full px-4 py-2 font-bold text-gray-600 hover:bg-sand">Back to real today</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

function Stat({ number, label }: { number: number; label: string }) {
  return (
    <div className="rounded-3xl bg-sand p-6">
      <p className="text-4xl font-extrabold text-sea-dark">{number}</p>
      <p className="mt-1 font-bold text-gray-700">{label}</p>
    </div>
  );
}
