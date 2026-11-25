"use client";

import Link from "next/link";

export default function MeetingsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="text-3xl font-semibold">The meeting page could not be loaded</h1>
      <p>Please try again in a moment.</p>
      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={reset} className="home-action">Try Again</button>
        <Link href="/meetings" className="underline">Back to meetings</Link>
      </div>
    </section>
  );
}
