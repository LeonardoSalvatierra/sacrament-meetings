import { getMeetingById } from "../../../../lib/meetings-db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext,
): Promise<Response> {
  const { id } = await params;
  const meetingId = Number(id);

  if (!/^\d+$/.test(id) || !Number.isSafeInteger(meetingId)) {
    return Response.json({ error: "Invalid meeting ID." }, { status: 400 });
  }

  const meeting = getMeetingById(meetingId);

  if (!meeting) {
    return Response.json({ error: "Meeting not found." }, { status: 404 });
  }

  return Response.json(meeting);
}