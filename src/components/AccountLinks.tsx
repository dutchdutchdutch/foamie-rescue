import Link from "next/link";
import { signOutAction } from "@/app/signin/actions";
import { currentPerson } from "@/lib/auth";

// Header links that depend on whether you're signed in.
export async function AccountLinks() {
  const person = await currentPerson();
  if (!person) {
    return (
      <Link href="/signin" className="rounded-full px-3 py-2 text-sea-dark hover:bg-sand">
        Sign in
      </Link>
    );
  }
  return (
    <>
      <Link href="/mine" className="rounded-full px-3 py-2 text-sea-dark hover:bg-sand">
        Mine
      </Link>
      <form action={signOutAction}>
        <button type="submit" title={`Signed in as ${person.contact}`} className="rounded-full px-3 py-2 text-sea-dark hover:bg-sand">
          Sign out
        </button>
      </form>
    </>
  );
}
