import Link from "next/link";
import MeetingBrowser from "../../../components/MeetingBrowser";
import MeetingSearch from "../../../components/MeetingSearch";
import { getMeetingsPage } from "../../../lib/meetings-db";

export const dynamic = "force-dynamic";

type MeetingsSearchParams = {
  query?: string | string[];
  page?: string | string[];
};

export default async function MeetingsPage({
  searchParams,
}: {
  searchParams: Promise<MeetingsSearchParams>;
}) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query.trim() : "";
  const pageNumber =
    typeof params.page === "string" && /^\d+$/.test(params.page)
      ? Number(params.page)
      : 1;
  const requestedPage =
    Number.isSafeInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;

  const { meetings, currentPage, totalPages } = await getMeetingsPage(query, requestedPage);

  function pageHref(page: number) {
    const nextParams = new URLSearchParams({ page: String(page) });
    if (query) nextParams.set("query", query);
    return `/meetings?${nextParams.toString()}`;
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-14">
      <h1 className="mb-6 text-3xl font-semibold text-[var(--primary-color)] md:text-4xl">
        All Meetings
      </h1>

      <MeetingSearch />

      {meetings.length > 0 ? (
        <MeetingBrowser
          meetings={meetings}
          pagination={
            <nav
              aria-label="Meeting pages"
              className="mt-4 flex items-center justify-center gap-3"
              >
              <div className="w-11">
                {currentPage > 1 && (
                  <Link
                    href={pageHref(currentPage - 1)}
                    aria-label="Previous page"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-current text-lg hover:bg-[var(--surface-bg)]"
                  >
                    <span aria-hidden="true">←</span>
                  </Link>
                )}
              </div>

              <span className="whitespace-nowrap text-center text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <div className="w-11">
                {currentPage < totalPages && (
                  <Link
                    href={pageHref(currentPage + 1)}
                    aria-label="Next page"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-current text-lg hover:bg-[var(--surface-bg)]"
                  >
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </nav>
          }
        />
      ) : (
        <p>
          {query ? "No programs match your search." : "No meeting programs are available."}
        </p>
      )}
    </main>
  );
}