import MeetingForm from "@/components/MeetingForm";
import { createMeeting } from "@/lib/actions";
import { requireMeetingAdmin } from "@/lib/meeting-admin";
import { meetingFormValues } from "@/lib/meeting-form";

export default async function NewMeetingPage() {
  await requireMeetingAdmin();
  return (
    <>
      <h1 className="text-3xl font-semibold">Create meeting</h1>
      <MeetingForm action={createMeeting} values={meetingFormValues()} submitLabel="Create meeting" />
    </>
  );
}
