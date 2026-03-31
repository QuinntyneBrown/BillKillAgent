"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ROUTES } from "@/lib/constants";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex items-center justify-between py-4 lg:py-6">
      {title && (
        <h1 className="font-serif text-[38px] leading-tight text-text-primary">
          {title}
        </h1>
      )}
      <div className="flex items-center gap-4 ml-auto">
        <Link
          href={ROUTES.notifications}
          data-testid="notification-bell"
          className="relative p-2 rounded-nav hover:bg-card-hover transition-colors"
        >
          <Bell className="w-5 h-5 text-text-secondary" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
        </Link>
        <div data-testid="user-avatar">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-accent/20 text-accent text-xs">
              AJ
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
