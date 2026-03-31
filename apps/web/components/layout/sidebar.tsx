"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  LayoutDashboard,
  CreditCard,
  ListChecks,
  Phone,
  PiggyBank,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: ROUTES.dashboard },
  { label: "Subscriptions", icon: CreditCard, href: ROUTES.subscriptions },
  { label: "Actions", icon: ListChecks, href: ROUTES.actions },
  { label: "Negotiations", icon: Phone, href: ROUTES.negotiations },
  { label: "Savings", icon: PiggyBank, href: ROUTES.savings },
  { label: "Settings", icon: Settings, href: ROUTES.settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      data-testid="sidebar"
      className="hidden lg:flex flex-col w-[260px] h-screen bg-card border-r border-border-subtle fixed left-0 top-0 z-30"
    >
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="flex items-center justify-center w-8 h-8 rounded-btn bg-accent">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-mono text-base font-medium tracking-wider text-text-primary">
          BILL KILL
        </span>
      </div>

      <nav className="flex-1 px-3 py-2">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-nav text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent-tint text-accent"
                      : "text-text-tertiary hover:text-text-secondary hover:bg-card-hover"
                  )}
                >
                  <item.icon className="w-[18px] h-[18px]" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-3 py-4 border-t border-border-subtle">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-medium">
            AJ
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-text-primary">
              Alex Johnson
            </span>
            <span className="text-xs text-text-tertiary">Premium Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
