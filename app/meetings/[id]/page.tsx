"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MeetingDetail from "../../../components/MeetingDetail";
import type { SacramentMeeting } from "../../../lib/types";

type ProgramResult =
  | { meeting: SacramentMeeting }
  | { error: string };

export default function MeetingPage() {
  const { id } = useParams<{ id: string }>();

  return <MeetingProgram key={id} id={id} />;
}

function MeetingProgram({ id }: { id: string }) {
  const [result, setResult] = useState<ProgramResult | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProgram() {
      try {
        const response = await fetch(`/api/meetings/${encodeURIComponent(id)}`, {
          signal: controller.signal,
        });

        if (response.status === 400 || response.status === 404) {
          setResult({ error: "Meeting program not found." });
          return;
        }

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const meeting: SacramentMeeting = await response.json();
        setResult({ meeting });
      } catch {
        if (!controller.signal.aborted) {
          setResult({ error: "The program could not be loaded. Please reload the page." });
        }
      }
    }

    void loadProgram();
    return () => controller.abort();
  }, [id]);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 print:max-w-none print:p-0 print:text-black">
      {result && "meeting" in result && (
  <div className="mb-6 flex justify-end print:hidden">
    <button type="button" onClick={() => window.print()} className="home-action">
      Print Program
    </button>
  </div>
)}

      <h1 className="sr-only">Sunday Program</h1>
      {!result ? (
        <p role="status">Loading program…</p>
      ) : "error" in result ? (
        <p role="alert">{result.error}</p>
      ) : (
        <MeetingDetail meeting={result.meeting} />
      )}
    </main>
  );
}