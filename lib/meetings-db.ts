import type { SacramentMeeting } from "./types";

const regularMeeting: SacramentMeeting = {
  id: 1,
  date: "2026-11-08",
  meetingType: "regular",
  presiding: "Bishop Smith",
  conducting: "Brother Jones",
  announcements: ["Ward service project next Saturday."],
  openingHymn: { number: 2, title: "The Spirit of God" },
  openingPrayer: "Sister Williams",
  wardBusiness: [{ description: "Sustaining of a new Primary teacher" }],
  stakeBusiness: false,
  sacramentHymn: { number: 169, title: "In Remembrance of Thy Suffering" },
  speakers: [
    { name: "Sister Brown", topic: "Faith in Jesus Christ", type: "speaker" },
    { name: "Youth Choir", topic: "I Am a Child of God", type: "musical-number" },
  ],
  closingHymn: { number: 31, title: "O God, Our Help in Ages Past" },
  closingPrayer: "Brother Davis",
};

const meetings: SacramentMeeting[] = [
    
      {
    id: 6,
    date: "2026-11-15",
    meetingType: "regular",
    presiding: "Bishop Smith",
    conducting: "Brother Jones",
    announcements: ["Bring a donation for the ward food drive."],
    openingHymn: {
      number: 19,
      title: "We Thank Thee, O God, for a Prophet",
    },
    openingPrayer: "Sister Garcia",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: {
      number: 169,
      title: "As Now We Take the Sacrament",
    },
    speakers: [
      { name: "Sister Garcia", topic: "Gratitude", type: "speaker" },
      { name: "Brother Lopez", topic: "Serving Our Neighbors", type: "speaker" },
    ],
    closingHymn: { number: 152, title: "God Be with You Till We Meet Again" },
    closingPrayer: "Brother Lopez",
  },
  
    regularMeeting,
  {
    
    ...regularMeeting,
    id: 2,
    date: "2026-11-01",
    meetingType: "testimony",
    announcements: [],
    wardBusiness: [],
    speakers: [],
  },
  {
    ...regularMeeting,
    id: 3,
    date: "2026-10-25",
    announcements: ["Youth activity on Wednesday."],
    wardBusiness: [],
    stakeBusiness: true,
  },
  {
    ...regularMeeting,
    id: 4,
    date: "2026-10-18",
    meetingType: "stake",
    presiding: "President Taylor",
    conducting: "President Taylor",
    announcements: [],
    wardBusiness: [],
    sacramentHymn: null,
    speakers: [{ name: "President Taylor", topic: "Serving others", type: "speaker" }],
  },
  {
    ...regularMeeting,
    id: 5,
    date: "2026-10-04",
    meetingType: "general",
    presiding: "First Presidency",
    conducting: "Conference leadership",
    announcements: [],
    wardBusiness: [],
    sacramentHymn: null,
    speakers: [],
  },
];

export function getMeetings(date?: string | null): SacramentMeeting[] {
  return date ? meetings.filter((meeting) => meeting.date === date) : meetings;
}

export function getMeetingById(id: number): SacramentMeeting | null {
  return meetings.find((meeting) => meeting.id === id) ?? null;
}