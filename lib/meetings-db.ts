import { neon } from "@neondatabase/serverless";
import type { SacramentMeeting } from "./types";

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return neon(databaseUrl);
}

export async function getMeetings(
  date?: string | null,
  range?: { start: string; end: string },
): Promise<SacramentMeeting[]> {
  const sql = getSql();
  const dateFilter = date || null;
  const start = range?.start ?? null;
  const end = range?.end ?? null;

  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type AS "meetingType",
      presiding,
      conducting,
      announcements,
      opening_hymn AS "openingHymn",
      opening_prayer AS "openingPrayer",
      ward_business AS "wardBusiness",
      stake_business AS "stakeBusiness",
      sacrament_hymn AS "sacramentHymn",
      speakers,
      closing_hymn AS "closingHymn",
      closing_prayer AS "closingPrayer"
    FROM meetings
    WHERE (${dateFilter}::text IS NULL OR to_char(date, 'YYYY-MM-DD') = ${dateFilter})
      AND (${start}::date IS NULL OR date >= ${start}::date)
      AND (${end}::date IS NULL OR date <= ${end}::date)
    ORDER BY meetings.date DESC
  `;

  return rows as unknown as SacramentMeeting[];
}

export async function getMeetingsPage(query: string, requestedPage: number) {
  const sql = getSql();
  const search = `%${query}%`;

  const rows = await sql`
    WITH matching AS (
      SELECT
        id,
        to_char(date, 'YYYY-MM-DD') AS "date",
        meeting_type AS "meetingType",
        presiding,
        conducting,
        announcements,
        opening_hymn AS "openingHymn",
        opening_prayer AS "openingPrayer",
        ward_business AS "wardBusiness",
        stake_business AS "stakeBusiness",
        sacrament_hymn AS "sacramentHymn",
        speakers,
        closing_hymn AS "closingHymn",
        closing_prayer AS "closingPrayer"
      FROM meetings
      WHERE (
          ${query} = ''
          OR presiding ILIKE ${search}
          OR conducting ILIKE ${search}
          OR meeting_type ILIKE ${search}
          OR EXISTS (
            SELECT 1
            FROM jsonb_array_elements(speakers) AS speaker
            WHERE speaker->>'name' ILIKE ${search}
          )
        )
    ),
    totals AS (
      SELECT GREATEST(1, (COUNT(*) + 4) / 5)::int AS "totalPages"
      FROM matching
    ),
    pagination AS (
      SELECT
        "totalPages",
        LEAST(${requestedPage}::bigint, "totalPages")::int AS "currentPage"
      FROM totals
    )
    SELECT pagination.*, page_meetings.*
    FROM pagination
    LEFT JOIN LATERAL (
      SELECT *
      FROM matching
      ORDER BY date DESC, id DESC
      LIMIT 5 OFFSET ((pagination."currentPage" - 1) * 5)
    ) AS page_meetings ON TRUE
    ORDER BY page_meetings.date DESC, page_meetings.id DESC
  `;

  const results = rows as unknown as (
    | (SacramentMeeting & { totalPages: number; currentPage: number })
    | { id: null; totalPages: number; currentPage: number }
  )[];

  return {
    meetings: results.flatMap(({ totalPages, currentPage, ...meeting }) => {
      void totalPages;
      void currentPage;
      return meeting.id === null ? [] : [meeting];
    }),
    totalPages: results[0].totalPages,
    currentPage: results[0].currentPage,
  };
}

export async function getMeetingById(
  id: number,
): Promise<SacramentMeeting | null> {
  const sql = getSql();

  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type AS "meetingType",
      presiding,
      conducting,
      announcements,
      opening_hymn AS "openingHymn",
      opening_prayer AS "openingPrayer",
      ward_business AS "wardBusiness",
      stake_business AS "stakeBusiness",
      sacrament_hymn AS "sacramentHymn",
      speakers,
      closing_hymn AS "closingHymn",
      closing_prayer AS "closingPrayer"
    FROM meetings
    WHERE id = ${id}
  `;

  return (rows[0] as SacramentMeeting | undefined) ?? null;
}

type MeetingData = Omit<SacramentMeeting, "id">;

export async function addMeeting(data: MeetingData): Promise<SacramentMeeting> {
  const sql = getSql();
  const [row] = await sql`
    INSERT INTO meetings (
      date, meeting_type, presiding, conducting, announcements, opening_hymn,
      opening_prayer, ward_business, stake_business, sacrament_hymn, speakers,
      closing_hymn, closing_prayer
    ) VALUES (
      ${data.date}::date, ${data.meetingType}, ${data.presiding}, ${data.conducting},
      (jsonb_populate_record(NULL::meetings, jsonb_build_object('announcements', ${JSON.stringify(data.announcements ?? [])}::jsonb))).announcements,
      ${JSON.stringify(data.openingHymn)}::jsonb, ${data.openingPrayer},
      ${JSON.stringify(data.wardBusiness)}::jsonb, ${data.stakeBusiness},
      ${JSON.stringify(data.sacramentHymn)}::jsonb,
      ${JSON.stringify(data.speakers)}::jsonb, ${JSON.stringify(data.closingHymn)}::jsonb,
      ${data.closingPrayer}
    ) RETURNING id
  `;
  return { ...data, id: Number(row.id) };
}

export async function updateMeeting(id: number, data: MeetingData): Promise<SacramentMeeting | null> {
  const sql = getSql();
  const [row] = await sql`
    UPDATE meetings SET
      date = ${data.date}::date,
      meeting_type = ${data.meetingType},
      presiding = ${data.presiding},
      conducting = ${data.conducting},
      announcements = (jsonb_populate_record(NULL::meetings, jsonb_build_object('announcements', ${JSON.stringify(data.announcements ?? [])}::jsonb))).announcements,
      opening_hymn = ${JSON.stringify(data.openingHymn)}::jsonb,
      opening_prayer = ${data.openingPrayer},
      ward_business = ${JSON.stringify(data.wardBusiness)}::jsonb,
      stake_business = ${data.stakeBusiness},
      sacrament_hymn = ${JSON.stringify(data.sacramentHymn)}::jsonb,
      speakers = ${JSON.stringify(data.speakers)}::jsonb,
      closing_hymn = ${JSON.stringify(data.closingHymn)}::jsonb,
      closing_prayer = ${data.closingPrayer}
    WHERE id = ${id}
    RETURNING id
  `;
  return row ? { ...data, id: Number(row.id) } : null;
}

export async function deleteMeeting(id: number): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`DELETE FROM meetings WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
