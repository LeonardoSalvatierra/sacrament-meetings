"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { SacramentMeeting } from "../lib/types";
import MeetingCard from "./MeetingCard";
import MeetingDetail from "./MeetingDetail";

export default function MeetingBrowser({
  meetings,
  pagination,
}: {
  meetings: SacramentMeeting[];
  pagination: ReactNode;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected =
    meetings.find((meeting) => meeting.id === selectedId) ?? meetings[0];

  if (!selected) {
    return <p>No past meeting programs are available.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
      <div>
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

        {pagination}
      </div>

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