import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { listMessages } from "@/lib/outbox";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `Pretend inbox · ${site.name}` };

export default function InboxPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-extrabold text-sea-dark">📬 Pretend inbox</h1>
      <p className="mt-2 text-gray-700">
        This site doesn&apos;t send real emails or texts yet. Every message it <em>would</em> send shows up here
        instead, newest first. Refresh the page to see new ones.
      </p>
      <Suspense fallback={<div className="mt-8 h-40 animate-pulse rounded-3xl bg-sand" />}>
        <Messages />
      </Suspense>
    </section>
  );
}

async function Messages() {
  await connection();
  const messages = listMessages();
  if (messages.length === 0) {
    return <p className="mt-8 rounded-3xl bg-sand p-8 text-center text-gray-600">No messages yet.</p>;
  }
  return (
    <ul className="mt-8 flex flex-col gap-4">
      {messages.map((m) => (
        <li key={m.id} className="rounded-3xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            To <strong className="text-gray-700">{m.to}</strong> ·{" "}
            {new Date(m.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-sea-dark">{m.subject}</h2>
          <p className="mt-2 whitespace-pre-line text-gray-700">{m.body}</p>
        </li>
      ))}
    </ul>
  );
}
