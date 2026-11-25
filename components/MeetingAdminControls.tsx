"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { deleteMeeting, signInToMeetingAdmin } from "@/lib/actions";

export function MeetingAdminSignIn() {
  const [error, action, pending] = useActionState(signInToMeetingAdmin, null);
  return (
    <form action={action} className="mt-4 max-w-sm space-y-3">
      <label htmlFor="admin-password" className="block font-medium">Administration passphrase</label>
      <input id="admin-password" name="password" type="password" required autoComplete="current-password"
        aria-describedby="admin-password-error" aria-invalid={!!error}
        className="w-full rounded-md border border-[var(--border-color)] px-3 py-2" />
      <p id="admin-password-error" aria-live="polite" className="text-sm text-red-800">{error}</p>
      <button type="submit" className="home-action" disabled={pending}>Sign in</button>
    </form>
  );
}

function DeleteButton({ date }: { date: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" aria-label={`Delete meeting on ${date}`} disabled={pending} className="text-red-800 underline">{pending ? "Deleting..." : "Delete"}</button>;
}

export function DeleteMeetingForm({ id, date }: { id: number; date: string }) {
  return (
    <form action={deleteMeeting.bind(null, id)} onSubmit={(event) => {
      if (!window.confirm(`Delete the meeting on ${date}?`)) event.preventDefault();
    }}>
      <DeleteButton date={date} />
    </form>
  );
}
