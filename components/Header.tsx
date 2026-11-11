"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Argentina/Buenos_Aires",
  month: "short",
  day: "numeric",
  year: "numeric",
});

function subscribeToClock(onChange: () => void) {
  const timer = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(timer);
}

function getToday() {
  return dateFormatter.format(new Date());
}

function getServerDate() {
  return "";
}

export default function Header() {
  const pathname = usePathname();
  const today = useSyncExternalStore(
    subscribeToClock,
    getToday,
    getServerDate,
  );
  const inMeetings = pathname === "/meetings" || pathname.startsWith("/meetings/");

  return (
    <header className="home-nav shrink-0 print:hidden">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 text-sm sm:px-6 sm:text-base"
      >
        <div>
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className="block font-semibold"
          >
            Alberdi Ward
          </Link>
          <p className="min-h-4 text-xs">{today}</p>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/meetings/upcoming" className="hover:underline">
                This Week
            </Link>
          <Link
            href="/meetings"
            aria-current={pathname === "/meetings" ? "page" : undefined}
            className={inMeetings ? "underline underline-offset-4" : "hover:underline"}
          >
            Past Meetings
          </Link>
        </div>
      </nav>
    </header>
  );
}