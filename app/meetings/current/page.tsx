import { redirect } from "next/navigation";
import { getMeetings } from "../../../lib/meetings-db";

export const dynamic = "force-dynamic";

export default function CurrentMeetingPage() {
  const localDate = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const sunday = new Date(`${localDate}T00:00:00Z`);
  sunday.setUTCDate(sunday.getUTCDate() - sunday.getUTCDay());

  const sundayDate = sunday.toISOString().slice(0, 10);
  const [meeting] = getMeetings(sundayDate);

  redirect(meeting ? `/meetings/${meeting.id}` : "/meetings");
}