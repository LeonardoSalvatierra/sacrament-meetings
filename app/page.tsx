import Image from "next/image";
import Link from "next/link";
import { formatMeetingDate, meetingLabels } from "../components/MeetingCard";
import { getUpcomingSunday, getWardToday } from "../lib/meeting-dates";
import { getMeetings } from "../lib/meetings-db";
import type { SacramentMeeting } from "../lib/types";
import chapelHero from "../public/alberdi-ward.jpg";

export const dynamic = "force-dynamic";

function ProgramSummary({ meeting }: { meeting: SacramentMeeting }) {
  const date = formatMeetingDate(meeting.date);

  return (
    <article className="grid gap-5 rounded-xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-5 sm:p-7 md:grid-cols-2 md:items-center">
      <div>
        <time
          dateTime={meeting.date}
          className="text-sm font-semibold text-[var(--secondary-color)]"
        >
          {date}
        </time>
        <h3 className="mt-2 text-xl font-semibold text-[var(--primary-color)]">
          {meetingLabels[meeting.meetingType]}
        </h3>
        <Link
          href={`/meetings/${meeting.id}`}
          aria-label={`View full program for ${date}`}
          className="home-action mt-4"
        >
          View Full Program
        </Link>
      </div>

      <dl className="border-t border-[var(--border-color)] pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
        <dt className="font-semibold">Opening Hymn</dt>
        <dd className="mt-1">
          No. {meeting.openingHymn.number} · {meeting.openingHymn.title}
        </dd>
      </dl>
    </article>
  );
}

export default function Home() {
  const today = getWardToday();
  const sunday = getUpcomingSunday(today);
  const meetings = getMeetings();
  const upcomingMeeting = meetings.find((meeting) => meeting.date === sunday);
  const recentMeetings = meetings
    .filter((meeting) => meeting.date < today)
    .sort((first, second) => second.date.localeCompare(first.date))
    .slice(0, 3);

  return (
    <main>
      <section className="home-hero" aria-labelledby="ward-title">
        <Image
          src={chapelHero}
          alt="Brick chapel with a white steeple under a blue sky"
          sizes="100vw"
          loading="eager"
          className="block h-auto w-full"
        />
        <div className="home-hero-title">
          <h1 id="ward-title" className="text-3xl font-semibold">
            Alberdi Ward
          </h1>
          <p className="mt-2 text-lg">Sacrament Meeting Planner</p>
        </div>
      </section>

      <div className="home-programs">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
          <section aria-labelledby="upcoming-title">
            <h2 id="upcoming-title" className="mb-5 text-2xl font-semibold md:text-3xl">
              Upcoming Sunday
            </h2>
            {upcomingMeeting ? (
              <ProgramSummary meeting={upcomingMeeting} />
            ) : (
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-5 sm:p-7">
                <p>
                  <time dateTime={sunday} className="font-semibold">
                    {formatMeetingDate(sunday)}
                  </time>
                  {" — Program not yet prepared."}
                </p>
                <Link href="/meetings/upcoming" className="home-action mt-4">
                  View Agenda
                </Link>
              </div>
            )}
          </section>

          <section aria-labelledby="recent-title" className="mt-12">
            <h2 id="recent-title" className="mb-5 text-2xl font-semibold md:text-3xl">
              Recent Meetings
            </h2>
            {recentMeetings.length > 0 ? (
              <ul className="grid gap-4">
                {recentMeetings.map((meeting) => (
                  <li key={meeting.id}>
                    <ProgramSummary meeting={meeting} />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No past programs are available yet.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}