import Link from "next/link";
import type { MeetingType, SacramentMeeting } from "../lib/types";

export const meetingLabels: Record<MeetingType, string> = {
  regular: "Regular Sacrament Meeting",
  testimony: "Fast and Testimony Meeting",
  stake: "Stake Conference",
  general: "General Conference",
};

export function formatMeetingDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(date));
}

type MeetingCardProps = {
  meeting: SacramentMeeting;
  selected: boolean;
  onSelect: () => void;
};

export default function MeetingCard({
  meeting,
  selected,
  onSelect,
}: MeetingCardProps) {
  const date = formatMeetingDate(meeting.date);
  const label = meetingLabels[meeting.meetingType];

  return (
    <>
      <article className="flex flex-col gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-5 lg:hidden">
        <div>
          <h3 className="text-lg font-semibold text-[var(--primary-color)]">
            <time dateTime={meeting.date}>{date}</time>
          </h3>
          <p className="mt-1">{label}</p>
        </div>

        <Link
          href={`/meetings/${meeting.id}`}
          aria-label={`View program for ${date}`}
          className="home-action home-action-secondary self-start"
        >
          View Program
        </Link>
      </article>

      <button
        type="button"
        aria-pressed={selected}
        onClick={onSelect}
        className="hidden w-full cursor-pointer rounded-lg border border-[var(--border-color)] bg-[var(--page-bg)] px-4 py-3 text-left hover:border-[var(--primary-color)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-color)] aria-pressed:border-[var(--primary-color)] aria-pressed:bg-[var(--primary-color)] aria-pressed:text-[var(--on-color-text)] lg:block"
      >
        <time dateTime={meeting.date} className="block font-semibold">
          {date}
        </time>
        <span className="mt-1 block text-sm">{label}</span>
      </button>
    </>
  );
}