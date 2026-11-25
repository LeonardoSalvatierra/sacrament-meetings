import MeetingBrowser from "@/components/MeetingBrowser";
import { formatMeetingDate } from "@/components/MeetingCard";
import { getWardWeek } from "@/lib/meeting-dates";
import { getMeetings } from "@/lib/meetings-db";

export const dynamic = "force-dynamic";

export default async function ThisWeekPage() {
  const week = getWardWeek();
  const meetings = await getMeetings(undefined, week);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold text-[var(--primary-color)]">
        This Week
      </h1>
      <p className="mb-6 mt-2">
        <time dateTime={week.start}>{formatMeetingDate(week.start)}</time>
        {" to "}
        <time dateTime={week.end}>{formatMeetingDate(week.end)}</time>
      </p>
      {meetings.length > 0 ? (
        <MeetingBrowser meetings={meetings} />
      ) : (
        <p>No meeting programs have been prepared for this week.</p>
      )}
    </main>
  );
}
