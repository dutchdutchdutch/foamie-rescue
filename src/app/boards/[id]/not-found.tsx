import Link from "next/link";

export default function BoardNotFound() {
  return (
    <div className="mt-6 rounded-3xl bg-sand p-10 text-center">
      <p className="text-lg font-bold text-sea-dark">We couldn&apos;t find that board.</p>
      <p className="mt-1 text-gray-600">Maybe it already found a home.</p>
      <Link href="/boards" className="mt-4 inline-block font-bold text-cta hover:underline">
        See boards waiting for a home →
      </Link>
    </div>
  );
}
