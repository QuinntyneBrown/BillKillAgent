"use client";

import { Sidebar } from "./sidebar";
import { BottomTabs } from "./bottom-tabs";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-page">
      <Sidebar />
      <main className="lg:ml-[260px] pb-20 lg:pb-0">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10">
          {children}
        </div>
      </main>
      <BottomTabs />
    </div>
  );
}
