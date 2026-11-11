import MeetingBrowser from "../../components/MeetingBrowser";

export default function MeetingsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-14">
      <h1 className="mb-6 text-3xl font-semibold text-[var(--primary-color)] md:text-4xl">
        Sunday Programs
      </h1>

      <MeetingBrowser />
    </main>
  );
}