"use client";

import Link from "next/link";
import { useActionState } from "react";
import { meetingTypes, type MeetingFormState, type MeetingFormValues } from "@/lib/meeting-form";

type Field = Exclude<keyof MeetingFormValues, "stakeBusiness" | "meetingType">;
type FormAction = (state: MeetingFormState, data: FormData) => Promise<MeetingFormState>;

const controlClass = "w-full rounded-md border border-[var(--border-color)] bg-[var(--on-color-text)] px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-color)]";
const groups: { label: string; fields: { id: Field; label: string; kind?: "date" | "number" | "multiline"; hint?: string }[] }[] = [
  { label: "Meeting details", fields: [
    { id: "date", label: "Meeting date", kind: "date" },
    { id: "presiding", label: "Presiding" },
    { id: "conducting", label: "Conducting" },
    { id: "announcements", label: "Announcements", kind: "multiline", hint: "Enter one announcement per line." },
  ] },
  { label: "Opening", fields: [
    { id: "openingHymnNumber", label: "Opening hymn number", kind: "number" },
    { id: "openingHymnTitle", label: "Opening hymn title" },
    { id: "openingPrayer", label: "Opening prayer" },
  ] },
  { label: "Business and sacrament", fields: [
    { id: "wardBusiness", label: "Ward business", kind: "multiline", hint: "Enter one item per line." },
    { id: "sacramentHymnNumber", label: "Sacrament hymn number (optional)", kind: "number" },
    { id: "sacramentHymnTitle", label: "Sacrament hymn title (optional)" },
  ] },
  { label: "Speakers and closing", fields: [
    { id: "speakers", label: "Speakers and musical numbers", kind: "multiline", hint: "One entry per line. Example: Maria Lopez | Faith | speaker. For music, use musical-number as the last value." },
    { id: "closingHymnNumber", label: "Closing hymn number", kind: "number" },
    { id: "closingHymnTitle", label: "Closing hymn title" },
    { id: "closingPrayer", label: "Closing prayer" },
  ] },
];

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  return <p id={id + "-error"} aria-live="polite" className="text-sm text-red-800">{errors?.[0]}</p>;
}

export default function MeetingForm({
  action,
  values,
  submitLabel,
}: {
  action: FormAction;
  values: MeetingFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, { values });

  return (
    <form action={formAction} noValidate className="mt-6 space-y-6">
      {groups.map(({ label, fields }, index) => (
        <fieldset key={label} className="grid gap-4 rounded-lg border border-[var(--border-color)] p-4 sm:grid-cols-2">
          <legend className="px-1 font-semibold">{label}</legend>
          {index === 0 && (
            <div className="space-y-1">
              <label htmlFor="meetingType" className="block font-medium">Meeting type</label>
              <select id="meetingType" name="meetingType" defaultValue={state.values.meetingType} aria-describedby="meetingType-error" aria-invalid={!!state.errors?.meetingType} className={controlClass}>
                {meetingTypes.map((type) => <option key={type} value={type}>{type[0].toUpperCase() + type.slice(1)}</option>)}
              </select>
              <FieldError id="meetingType" errors={state.errors?.meetingType} />
            </div>
          )}
          {fields.map(({ id, label, kind, hint }) => {
            const error = state.errors?.[id];
            const props = {
              id,
              name: id,
              defaultValue: state.values[id],
              "aria-describedby": [id + "-error", hint && id + "-hint"].filter(Boolean).join(" "),
              "aria-invalid": !!error,
              className: controlClass,
            };
            return (
              <div key={id} className={kind === "multiline" ? "space-y-1 sm:col-span-2" : "space-y-1"}>
                <label htmlFor={id} className="block font-medium">{label}</label>
                {hint && <p id={id + "-hint"} className="text-sm">{hint}</p>}
                {kind === "multiline" ? <textarea {...props} rows={3} /> : <input {...props} type={kind ?? "text"} />}
                <FieldError id={id} errors={error} />
              </div>
            );
          })}
          {index === 2 && (
            <div className="space-y-1 sm:col-span-2">
              <label htmlFor="stakeBusiness" className="flex items-center gap-2">
                <input id="stakeBusiness" name="stakeBusiness" type="checkbox" defaultChecked={state.values.stakeBusiness} aria-describedby="stakeBusiness-error" />
                Stake business
              </label>
              <FieldError id="stakeBusiness" errors={state.errors?.stakeBusiness} />
            </div>
          )}
        </fieldset>
      ))}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="home-action" disabled={pending}>
          {pending ? "Saving..." : submitLabel}
        </button>
        <Link href="/meetings/admin" className="underline">Cancel</Link>
      </div>
    </form>
  );
}
