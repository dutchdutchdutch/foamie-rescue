import type { Metadata } from "next";
import { site } from "@/lib/site";
import { GiveForm } from "./GiveForm";

export const metadata: Metadata = { title: `List a board · ${site.name}` };

export default function GivePage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-extrabold text-sea-dark">Give a foamie a second life</h1>
      <p className="mt-2 text-lg text-gray-700">
        It&apos;s free and takes a minute. Every board you pass on is one less new foamie made.
      </p>
      <p className="mt-4 rounded-2xl bg-sand p-4 text-sm text-gray-700">
        Coming next: you&apos;ll confirm your phone or email here, so people can ask for your board.
      </p>
      <GiveForm />
    </section>
  );
}
