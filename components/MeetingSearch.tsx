"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useRef } from "react";

export default function MeetingSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
    const inputRef = useRef<HTMLInputElement>(null);

  const search = useDebouncedCallback((value: string) => {
    const query = value.trim();
    const params = new URLSearchParams(searchParams.toString());

    if (query === (params.get("query") ?? "")) return;

    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);
   useEffect(() => {
  function restoreSearchFromUrl() {
    search.cancel();

    if (inputRef.current) {
      const params = new URLSearchParams(window.location.search);
      inputRef.current.value = params.get("query") ?? "";
    }
  }

  window.addEventListener("popstate", restoreSearchFromUrl);
  return () => window.removeEventListener("popstate", restoreSearchFromUrl);
}, [search]); 

  return (
    <label className="mb-6 block max-w-md">
      <span className="mb-2 block font-semibold">Search meetings</span>
      <input
  ref={inputRef}
  type="search"
        aria-label="Search meetings"
        placeholder="Search by speaker, leader, or meeting type"
        defaultValue={searchParams.get("query") ?? ""}
        onChange={(event) => search(event.target.value)}
        className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface-bg)] px-4 py-2"
      />
    </label>
  );
}