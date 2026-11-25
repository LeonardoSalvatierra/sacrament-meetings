import { notFound } from "next/navigation";
import MeetingForm from "@/components/MeetingForm";
import { updateMeeting } from "@/lib/actions";
import { requireMeetingAdmin } from "@/lib/meeting-admin";
import { getMeetingById } from "@/lib/meetings-db";
import { meetingFormValues } from "@/lib/meeting-form";

export default async function EditMeetingPage({ params }: { params: Promise<{ id: string }> }) {
  await requireMeetingAdmin();
  const { id } = await params;
  const meetingId = Number(id);
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(meetingId) || meetingId < 1) notFound();

  const meeting = await getMeetingById(meetingId);
  if (!meeting) notFound();

  return (
    <>
      <h1 className="text-3xl font-semibold">Edit meeting</h1>
      <MeetingForm action={updateMeeting.bind(null, meeting.id)}
        values={meetingFormValues(meeting)} submitLabel="Save changes" />
    </>
  );
}
