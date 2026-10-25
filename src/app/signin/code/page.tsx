import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { cleanContact, isPhone, safeNext } from "@/lib/auth";
import { site } from "@/lib/site";
import { CodeForm } from "../SignInForms";

export const metadata: Metadata = { title: `Type your code · ${site.name}` };

export default function CodePage(props: PageProps<"/signin/code">) {
  return (
    <section className="mx-auto max-w-xl px-4 py-12">
      <Suspense>
        <Content searchParams={props.searchParams} />
      </Suspense>
    </section>
  );
}

async function Content({ searchParams }: Pick<PageProps<"/signin/code">, "searchParams">) {
  const params = await searchParams;
  const to = cleanContact(String(params.to ?? ""));
  const next = safeNext(params.next);
  if (!to) {
    return (
      <p>
        Something went wrong. <Link href="/signin" className="font-bold text-cta underline">Start again</Link>.
      </p>
    );
  }
  return (
    <>
      <h1 className="text-4xl font-extrabold text-sea-dark">Check your {isPhone(to) ? "texts" : "email"}</h1>
      <p className="mt-2 text-lg text-gray-700">
        We sent a code to <strong>{to}</strong>.
      </p>
      <p className="mt-4 rounded-2xl bg-sand p-4 text-sm text-gray-700">
        Nothing is really sent yet. Your code is in the{" "}
        <a href="/inbox" target="_blank" className="font-bold text-sea underline">
          pretend inbox
        </a>{" "}
        (opens in a new tab).
      </p>
      <CodeForm to={to} next={next} />
      <Link href={`/signin?next=${encodeURIComponent(next)}`} className="mt-6 inline-block text-sm font-bold text-sea hover:underline">
        Use a different phone or email
      </Link>
    </>
  );
}
