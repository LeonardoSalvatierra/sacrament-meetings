import Link from "next/link";
import type { ReactNode } from "react";

export default function MeetingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav
        aria-label="Meeting navigation"
        className="mx-auto w-full max-w-7xl px-4 pt-6 text-sm sm:px-6 print:hidden"
      >
        <Link
          href="/"
          className="font-semibold text-[var(--primary-color)] underline underline-offset-4"
        >
          Back to Home
        </Link>
      </nav>
      {children}
    </>
  );
}