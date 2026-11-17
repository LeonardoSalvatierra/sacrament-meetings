"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();
  const inMeetings =
    pathname === "/meetings" || pathname.startsWith("/meetings/");

  return (
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
  );
}