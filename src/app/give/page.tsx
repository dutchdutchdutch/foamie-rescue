import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { currentPerson } from "@/lib/auth";
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
      <Suspense fallback={<div className="mt-8 h-64 animate-pulse rounded-3xl bg-sand" />}>
        <SignedInForm />
      </Suspense>
    </section>
  );
}

// You confirm your phone or email first, so people who ask for your board can reach you.
async function SignedInForm() {
  const person = await currentPerson();
  if (!person) {
    return (
      <div className="mt-8 rounded-3xl bg-sand p-6">
        <p className="text-lg font-extrabold text-sea-dark">First, confirm your phone or email</p>
        <p className="mt-1 text-gray-700">
          It takes a few seconds. We only share it with someone after you both say yes to a pickup.
        </p>
        <Link
          href="/signin?next=/give"
          className="mt-4 inline-block rounded-full bg-cta px-6 py-2.5 font-bold text-white hover:bg-cta-dark"
        >
          Confirm it&apos;s me
        </Link>
      </div>
    );
  }
  return (
    <>
      <p className="mt-4 text-sm text-gray-600">
        Listing as <strong>{person.contact}</strong>. This is never shown on the site.
      </p>
      <GiveForm />
    </>
  );
}
