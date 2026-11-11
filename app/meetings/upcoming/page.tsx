import { redirect } from "next/navigation";
import { formatMeetingDate } from "../../../components/MeetingCard";
import { getUpcomingSunday } from "../../../lib/meeting-dates";
import { getMeetings } from "../../../lib/meetings-db";

export const dynamic = "force-dynamic";

const agendaFields = [
  "Meeting Type",
  "Presiding",
  "Conducting",
  "Announcements",
  "Opening Hymn",
  "Opening Prayer",
  "Ward Business",
  "Stake Business",
  "Sacrament Hymn",
  "Speakers and Musical Numbers",
  "Closing Hymn",
  "Closing Prayer",
];

export default function UpcomingMeetingPage() {
  const sunday = getUpcomingSunday();
  const [meeting] = getMeetings(sunday);

  if (meeting) {
    redirect(`/meetings/${meeting.id}`);
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold text-[var(--primary-color)]">
        Upcoming Sunday
      </h1>
      <p className="mt-2">
        <time dateTime={sunday}>{formatMeetingDate(sunday)}</time>
      </p>

      <p className="mt-5 rounded-lg border border-[var(--border-color)] bg-[var(--surface-bg)] p-4 font-semibold">
        This program has not been prepared yet.
      </p>

      <dl className="mt-6 divide-y divide-[var(--border-color)] rounded-xl border border-[var(--border-color)] bg-[var(--on-color-text)] px-5">
        {agendaFields.map((field) => (
          <div key={field} className="flex justify-between gap-4 py-3">
            <dt className="font-medium">{field}</dt>
            <dd>—</dd>
          </div>
        ))}
      </dl>
    </main>
  );
}