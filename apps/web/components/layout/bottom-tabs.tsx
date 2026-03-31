"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  ListChecks,
  PiggyBank,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

const tabs = [
  { label: "Dashboard", icon: LayoutDashboard, href: ROUTES.dashboard },
  { label: "Subs", icon: CreditCard, href: ROUTES.subscriptions },
  { label: "Actions", icon: ListChecks, href: ROUTES.actions },
  { label: "Savings", icon: PiggyBank, href: ROUTES.savings },
  { label: "Settings", icon: Settings, href: ROUTES.settings },
];

export function BottomTabs() {
  const pathname = usePathname();

  return (
    <nav
      data-testid="bottom-tabs"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border-subtle"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/" && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 text-[11px] font-medium transition-colors",
                isActive
                  ? "text-accent"
                  : "text-text-muted hover:text-text-tertiary"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
