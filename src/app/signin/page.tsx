import type { Metadata } from "next";
import { Suspense } from "react";
import { safeNext } from "@/lib/auth";
import { site } from "@/lib/site";
import { ContactForm } from "./SignInForms";

export const metadata: Metadata = { title: `Confirm it's you · ${site.name}` };

export default function SignInPage(props: PageProps<"/signin">) {
  return (
    <section className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-4xl font-extrabold text-sea-dark">Confirm it&apos;s you</h1>
      <p className="mt-2 text-lg text-gray-700">
        We&apos;ll send you a 6-digit code. No password needed. We never show your phone or email on the site.
      </p>
      <Suspense>
        <Form searchParams={props.searchParams} />
      </Suspense>
    </section>
  );
}

async function Form({ searchParams }: Pick<PageProps<"/signin">, "searchParams">) {
  const next = safeNext((await searchParams).next);
  return <ContactForm next={next} />;
}
