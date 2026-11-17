import { redirect } from "next/navigation";
import { getUpcomingSunday } from "../../../../lib/meeting-dates";
import { getMeetings } from "../../../../lib/meetings-db";

export const dynamic = "force-dynamic";

export default async function CurrentMeetingPage() {
  const sunday = getUpcomingSunday();
  const [meeting] = await getMeetings(sunday);

  redirect(meeting ? `/meetings/${meeting.id}` : "/meetings/upcoming");
}