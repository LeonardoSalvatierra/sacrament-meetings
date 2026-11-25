"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { addMeeting, updateMeeting as saveMeeting, deleteMeeting as removeMeeting } from "./meetings-db";
import { meetingFormValues, meetingTypes, type MeetingFormState } from "./meeting-form";
import { endMeetingAdminSession, requireMeetingAdmin, startMeetingAdminSession } from "./meeting-admin";

const required = z.string().trim().min(1, "This field is required.").max(200, "Use 200 characters or fewer.");
const optionalText = z.string().trim().max(4_000, "Use 4,000 characters or fewer.");
const positiveNumber = z.string().trim().regex(/^[1-9]\d{0,8}$/, "Enter a positive hymn number.");
const lines = (text: string) => text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

const meetingSchema = z.object({
  date: z.iso.date("Enter a valid meeting date."),
  meetingType: z.enum(meetingTypes, { error: "Choose a meeting type." }),
  presiding: required,
  conducting: required,
  announcements: optionalText,
  openingHymnNumber: positiveNumber,
  openingHymnTitle: required,
  openingPrayer: required,
  wardBusiness: optionalText,
  stakeBusiness: z.boolean(),
  sacramentHymnNumber: z.union([z.literal(""), positiveNumber]),
  sacramentHymnTitle: optionalText,
  speakers: optionalText,
  closingHymnNumber: positiveNumber,
  closingHymnTitle: required,
  closingPrayer: required,
}).superRefine((data, context) => {
  if (data.sacramentHymnNumber && !data.sacramentHymnTitle) {
    context.addIssue({ code: "custom", path: ["sacramentHymnTitle"], message: "Enter the hymn title." });
  }
  if (data.sacramentHymnTitle && !data.sacramentHymnNumber) {
    context.addIssue({ code: "custom", path: ["sacramentHymnNumber"], message: "Enter the hymn number." });
  }
  for (const line of lines(data.speakers)) {
    const [name, , type, extra] = line.split("|").map((part) => part.trim());
    if (!name || (type !== "speaker" && type !== "musical-number") || extra !== undefined) {
      context.addIssue({
        code: "custom",
        path: ["speakers"],
        message: "Use one entry per line in the format Name | Topic | speaker or musical-number.",
      });
      break;
    }
  }
});

function readText(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

async function save(form: FormData, id?: number): Promise<MeetingFormState> {
  await requireMeetingAdmin();
  if (id !== undefined && (!Number.isSafeInteger(id) || id < 1)) notFound();

  const defaults = meetingFormValues();
  const fields = Object.keys(defaults) as (keyof typeof defaults)[];
  const raw = Object.fromEntries(fields.map((key) => [
    key, key === "stakeBusiness" ? form.has(key) : readText(form, key),
  ]));
  const parsed = meetingSchema.safeParse(raw);
  if (!parsed.success) {
    return { values: raw as ReturnType<typeof meetingFormValues>, errors: z.flattenError(parsed.error).fieldErrors };
  }

  const value = parsed.data;
  const meeting = {
    date: value.date,
    meetingType: value.meetingType,
    presiding: value.presiding,
    conducting: value.conducting,
    announcements: lines(value.announcements),
    openingHymn: { number: Number(value.openingHymnNumber), title: value.openingHymnTitle },
    openingPrayer: value.openingPrayer,
    wardBusiness: lines(value.wardBusiness).map((description) => ({ description })),
    stakeBusiness: value.stakeBusiness,
    sacramentHymn: value.sacramentHymnNumber
      ? { number: Number(value.sacramentHymnNumber), title: value.sacramentHymnTitle }
      : null,
    speakers: lines(value.speakers).map((line) => {
      const [name, topic, type] = line.split("|").map((part) => part.trim());
      return { name, topic, type: type === "speaker" ? ("speaker" as const) : ("musical-number" as const) };
    }),
    closingHymn: { number: Number(value.closingHymnNumber), title: value.closingHymnTitle },
    closingPrayer: value.closingPrayer,
  };
  let saved;
  try {
    saved = id === undefined ? await addMeeting(meeting) : await saveMeeting(id, meeting);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "23505") {
      return { values: raw as ReturnType<typeof meetingFormValues>, errors: { date: ["A meeting already exists on this date."] } };
    }
    console.error("Unable to save the meeting", error);
    throw new Error("The meeting could not be saved. Please try again.");
  }
  if (!saved) notFound();
  finishMutation();
  redirect(id === undefined ? `/meetings/${saved.id}` : "/meetings/admin");
}

function finishMutation() {
  revalidatePath("/");
  revalidatePath("/meetings");
  revalidatePath("/meetings/admin");
  revalidatePath("/meetings/upcoming");
  revalidatePath("/meetings/this-week");
  revalidatePath("/meetings/current");
  revalidatePath("/meetings/[id]", "page");
}

export async function createMeeting(_previous: MeetingFormState, form: FormData) {
  return save(form);
}

export async function updateMeeting(id: number, _previous: MeetingFormState, form: FormData) {
  return save(form, id);
}

export async function deleteMeeting(id: number) {
  await requireMeetingAdmin();
  if (!Number.isSafeInteger(id) || id < 1) notFound();

  let removed;
  try {
    removed = await removeMeeting(id);
  } catch (error) {
    console.error("Unable to delete the meeting", error);
    throw new Error("The meeting could not be deleted. Please try again.");
  }
  if (!removed) notFound();
  finishMutation();
  redirect("/meetings/admin");
}

export async function signInToMeetingAdmin(_previous: string | null, form: FormData) {
  const error = await startMeetingAdminSession(form.get("password"));
  if (error) return error;
  redirect("/meetings/admin");
}

export async function signOutOfMeetingAdmin() {
  await endMeetingAdminSession();
  redirect("/meetings/admin");
}
