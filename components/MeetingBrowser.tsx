"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SacramentMeeting } from "../lib/types";
import MeetingCard from "./MeetingCard";
import MeetingDetail from "./MeetingDetail";
import { getWardToday } from "../lib/meeting-dates";

export default function MeetingBrowser() {
  const [meetings, setMeetings] = useState<SacramentMeeting[] | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMeetings() {
      try {
        const response = await fetch("/api/meetings", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data: SacramentMeeting[] = await response.json();
        const today = getWardToday();

        const pastMeetings = data
        .filter((meeting) => meeting.date < today)
        .sort((first, second) => second.date.localeCompare(first.date));

        setMeetings(pastMeetings);
      } catch {
        if (!controller.signal.aborted) {
          setError(true);
        }
      }
    }

    void loadMeetings();
    return () => controller.abort();
  }, []);

  if (error) {
    return <p role="alert">Programs could not be loaded. Please reload the page.</p>;
  }

  if (!meetings) {
    return <p role="status">Loading programs…</p>;
  }

  const selected = meetings.find((meeting) => meeting.id === selectedId) ?? meetings[0];

  if (!selected) {
    return <p>No past meeting programs are available.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
      <ul aria-label="Meeting dates" className="grid gap-3">
        {meetings.map((meeting) => (
          <li key={meeting.id}>
            <MeetingCard
              meeting={meeting}
              selected={meeting.id === selected.id}
              onSelect={() => setSelectedId(meeting.id)}
            />
          </li>
        ))}
      </ul>

      <div className="hidden min-w-0 lg:block">
        <div className="mb-3 flex justify-end">
          <Link
            href={`/meetings/${selected.id}`}
            className="home-action home-action-secondary"
          >
            Open Printable Program
          </Link>
        </div>
        <MeetingDetail meeting={selected} />
      </div>
    </div>
  );
}