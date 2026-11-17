import { formatMeetingDate, meetingLabels } from "./MeetingCard";
import type { Hymn, SacramentMeeting } from "../lib/types";

function formatHymn(hymn: Hymn): string {
  return `No. ${hymn.number} · ${hymn.title}`;
}

type MeetingDetailProps = {
  meeting: SacramentMeeting;
};

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  return (
    <article className="rounded-xl border border-[var(--border-color)] bg-[var(--on-color-text)] p-5 sm:p-8 print:border-0 print:p-0">
      <header className="border-b border-[var(--border-color)] pb-5">
        <p className="font-semibold text-[var(--primary-color)]">Alberdi Ward</p>
        <h2 className="mt-1 text-2xl font-semibold">
          {meetingLabels[meeting.meetingType]}
        </h2>
        <time dateTime={meeting.date} className="mt-2 block">
          {formatMeetingDate(meeting.date)}
        </time>
      </header>

      <div className="mt-5 space-y-5">
        <dl className="space-y-2">
          <div><dt className="inline font-semibold">Presiding: </dt><dd className="inline">{meeting.presiding}</dd></div>
          <div><dt className="inline font-semibold">Conducting: </dt><dd className="inline">{meeting.conducting}</dd></div>
        </dl>

        <section>
          <h3 className="font-semibold">Announcements</h3>
          {meeting.announcements?.length ? (
            <ul className="ml-5 list-disc">
              {meeting.announcements.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          ) : <p>None scheduled.</p>}
        </section>

        <section>
          <h3 className="font-semibold">Opening</h3>
          <p>Hymn: {formatHymn(meeting.openingHymn)}</p>
          <p>Prayer: {meeting.openingPrayer}</p>
        </section>

        <section>
          <h3 className="font-semibold">Ward and Stake Business</h3>
          {meeting.wardBusiness.length > 0 && (
            <ul className="ml-5 list-disc">
              {meeting.wardBusiness.map((item, index) => (
                <li key={index}>{item.description}</li>
              ))}
            </ul>
          )}
          <p>Stake business: {meeting.stakeBusiness ? "Yes" : "No"}</p>
        </section>

        {meeting.sacramentHymn && (
          <section>
            <h3 className="font-semibold">Sacrament Hymn</h3>
            <p>{formatHymn(meeting.sacramentHymn)}</p>
          </section>
        )}

        <section>
          <h3 className="font-semibold">Speakers and Musical Numbers</h3>
          {meeting.speakers.length ? (
            <ul className="ml-5 list-disc">
              {meeting.speakers.map((item, index) => (
                <li key={index}>
                  {item.type === "speaker" ? "Speaker" : "Musical number"}:{" "}
                  {item.name}{item.topic && ` — ${item.topic}`}
                </li>
              ))}
            </ul>
          ) : <p>None listed.</p>}
        </section>

        <section>
          <h3 className="font-semibold">Closing</h3>
          <p>Hymn: {formatHymn(meeting.closingHymn)}</p>
          <p>Prayer: {meeting.closingPrayer}</p>
        </section>
      </div>
    </article>
  );
}