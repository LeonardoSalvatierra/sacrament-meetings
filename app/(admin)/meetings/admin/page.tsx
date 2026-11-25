import Link from "next/link";
import { DeleteMeetingForm, MeetingAdminSignIn } from "@/components/MeetingAdminControls";
import { signOutOfMeetingAdmin } from "@/lib/actions";
import { hasMeetingAdmin } from "@/lib/meeting-admin";
import { getMeetings } from "@/lib/meetings-db";

export default async function ManageMeetingsPage() {
  if (!(await hasMeetingAdmin())) {
    return (
      <>
        <h1 className="text-3xl font-semibold">Manage meetings</h1>
        <MeetingAdminSignIn />
      </>
    );
  }

  const meetings = await getMeetings();
  return (
    <>
      <h1 className="text-3xl font-semibold">Manage meetings</h1>
      <div className="my-5 flex flex-wrap items-center gap-4">
        <Link href="/meetings/new" className="home-action">Create meeting</Link>
        <form action={signOutOfMeetingAdmin}>
          <button type="submit" className="underline">Sign out</button>
        </form>
      </div>
      {meetings.length === 0 ? <p>No meetings have been created.</p> : (
        <ul className="divide-y divide-[var(--border-color)]">
          {meetings.map((meeting) => (
            <li key={meeting.id} className="flex flex-wrap items-center gap-4 py-3">
              <Link href={`/meetings/${meeting.id}`} className="min-w-40 underline">
                <time dateTime={meeting.date}>{meeting.date}</time> {meeting.meetingType}
              </Link>
              <Link href={`/meetings/${meeting.id}/edit`} className="underline" aria-label={`Edit meeting on ${meeting.date}`}>Edit</Link>
              <DeleteMeetingForm id={meeting.id} date={meeting.date} />
            </li>
          ))}
        </ul>
      )}
      <Link href="/meetings" className="mt-4 inline-block underline">Back to meetings</Link>
    </>
  );
}
