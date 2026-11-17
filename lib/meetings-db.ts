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
): Promise<SacramentMeeting[]> {
  const sql = getSql();
  const dateFilter = date || null;

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
    WHERE ${dateFilter}::text IS NULL
       OR to_char(date, 'YYYY-MM-DD') = ${dateFilter}
    ORDER BY meetings.date DESC
  `;

  return rows as unknown as SacramentMeeting[];
}

export async function getPastMeetingsPage(
  today: string,
  query: string,
  requestedPage: number,
) {
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
      WHERE date < ${today}::date
        AND (
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

// Week 04: connect these operations to PostgreSQL.
export async function addMeeting(
  data: Omit<SacramentMeeting, "id">,
): Promise<SacramentMeeting> {
  void data;
  throw new Error("addMeeting will be implemented in Week 04.");
}

export async function updateMeeting(
  id: number,
  updates: Partial<SacramentMeeting>,
): Promise<SacramentMeeting | null> {
  void id;
  void updates;
  throw new Error("updateMeeting will be implemented in Week 04.");
}

export async function deleteMeeting(id: number): Promise<boolean> {
  void id;
  throw new Error("deleteMeeting will be implemented in Week 04.");
}