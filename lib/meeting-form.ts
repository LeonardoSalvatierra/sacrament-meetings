import type { SacramentMeeting } from "./types";

export const meetingTypes = ["regular", "testimony", "stake", "general"] as const;

export function meetingFormValues(meeting?: SacramentMeeting) {
  return {
    date: meeting?.date ?? "",
    meetingType: meeting?.meetingType ?? "regular",
    presiding: meeting?.presiding ?? "",
    conducting: meeting?.conducting ?? "",
    announcements: meeting?.announcements?.join("\n") ?? "",
    openingHymnNumber: meeting?.openingHymn.number.toString() ?? "",
    openingHymnTitle: meeting?.openingHymn.title ?? "",
    openingPrayer: meeting?.openingPrayer ?? "",
    wardBusiness: meeting?.wardBusiness.map((item) => item.description).join("\n") ?? "",
    stakeBusiness: meeting?.stakeBusiness ?? false,
    sacramentHymnNumber: meeting?.sacramentHymn?.number.toString() ?? "",
    sacramentHymnTitle: meeting?.sacramentHymn?.title ?? "",
    speakers: meeting?.speakers.map((item) => [item.name, item.topic, item.type].join(" | ")).join("\n") ?? "",
    closingHymnNumber: meeting?.closingHymn.number.toString() ?? "",
    closingHymnTitle: meeting?.closingHymn.title ?? "",
    closingPrayer: meeting?.closingPrayer ?? "",
  };
}

export type MeetingFormValues = ReturnType<typeof meetingFormValues>;
export type MeetingFormState = {
  values: MeetingFormValues;
  errors?: Partial<Record<keyof MeetingFormValues, string[]>>;
};
