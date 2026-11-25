import Link from "next/link";

export default function EditMeetingNotFound() {
  return (
    <>
      <h1 className="text-3xl font-semibold">Meeting not found</h1>
      <p className="my-4">This meeting may have been removed.</p>
      <Link className="underline" href="/meetings">Back to meetings</Link>
    </>
  );
}
