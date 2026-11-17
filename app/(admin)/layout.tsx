import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <p className="mb-4 text-sm font-semibold">Meeting Administration</p>
      {children}
    </main>
  );
}