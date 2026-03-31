"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Check,
  Clock,
  AlertTriangle,
  Share2,
  Phone,
  CreditCard,
  Info,
} from "lucide-react";

const notifications = [
  {
    title: "Price Increase Detected",
    description: "Spotify Premium is increasing from $10.99 to $12.99/mo starting next month.",
    time: "2h ago",
    icon: TrendingUp,
    iconColor: "text-error",
    iconBg: "bg-error/10",
    unread: true,
  },
  {
    title: "Negotiation Successful",
    description: "Verizon Wireless rate reduced from $85/mo to $60/mo. Saving $25/mo!",
    time: "5h ago",
    icon: Check,
    iconColor: "text-success",
    iconBg: "bg-success/10",
    unread: true,
  },
  {
    title: "Free Trial Ending",
    description: "Your Paramount+ free trial ends in 3 days. Cancel to avoid $11.99/mo charge.",
    time: "8h ago",
    icon: Clock,
    iconColor: "text-accent",
    iconBg: "bg-accent-tint",
    unread: true,
  },
  {
    title: "New Subscription Found",
    description: "Disney+ ($13.99/mo) was detected from your Chase Sapphire card.",
    time: "1d ago",
    icon: CreditCard,
    iconColor: "text-text-secondary",
    iconBg: "bg-card-hover",
    unread: false,
  },
  {
    title: "Cancellation Confirmed",
    description: "Headspace subscription has been successfully cancelled. Saving $12.99/mo.",
    time: "2d ago",
    icon: Check,
    iconColor: "text-success",
    iconBg: "bg-success/10",
    unread: false,
  },
];

export default function NotificationsPage() {
  const [alertDismissed, setAlertDismissed] = useState(false);

  return (
    <>
      <Header title="Notifications" />

      {/* Alert Banner */}
      {!alertDismissed && (
        <div
          data-testid="alert-banner"
          className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 mb-6 rounded-card bg-accent-tint border border-accent/20"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 rounded-btn bg-accent/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-accent" />
            </div>
            <p data-testid="alert-text" className="text-sm text-text-primary">
              Netflix price increasing from $22.99 to $24.99/mo starting April 2026.
              We can negotiate or find alternatives.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="primary" size="sm">
              Negotiate
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAlertDismissed(true)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Today section */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-text-tertiary mb-3">Today</h2>
        <div className="flex flex-col gap-2">
          {notifications.slice(0, 3).map((notif) => (
            <div
              key={notif.title}
              data-testid="notification-item"
              className="flex items-start gap-3 p-4 rounded-card bg-card border border-border-subtle hover:bg-card-hover transition-colors cursor-pointer"
            >
              <div
                className={`w-9 h-9 rounded-btn flex items-center justify-center shrink-0 ${notif.iconBg}`}
              >
                <notif.icon className={`w-4 h-4 ${notif.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text-primary">
                    {notif.title}
                  </p>
                  {notif.unread && (
                    <div
                      data-testid="unread-dot"
                      className="w-2.5 h-2.5 min-w-[10px] min-h-[10px] rounded-full bg-accent shrink-0"
                    />
                  )}
                </div>
                <p className="text-xs text-text-tertiary mt-0.5">
                  {notif.description}
                </p>
              </div>
              <span className="text-xs text-text-muted whitespace-nowrap">
                {notif.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Earlier section */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-text-tertiary mb-3">Earlier</h2>
        <div className="flex flex-col gap-2">
          {notifications.slice(3).map((notif) => (
            <div
              key={notif.title}
              data-testid="notification-item"
              className="flex items-start gap-3 p-4 rounded-card bg-card border border-border-subtle hover:bg-card-hover transition-colors cursor-pointer"
            >
              <div
                className={`w-9 h-9 rounded-btn flex items-center justify-center shrink-0 ${notif.iconBg}`}
              >
                <notif.icon className={`w-4 h-4 ${notif.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text-primary">
                    {notif.title}
                  </p>
                  {notif.unread && (
                    <div
                      data-testid="unread-dot"
                      className="w-2.5 h-2.5 min-w-[10px] min-h-[10px] rounded-full bg-accent shrink-0"
                    />
                  )}
                </div>
                <p className="text-xs text-text-tertiary mt-0.5">
                  {notif.description}
                </p>
              </div>
              <span className="text-xs text-text-muted whitespace-nowrap">
                {notif.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Report Card */}
      <Card
        data-testid="monthly-report"
        className="border-accent/20 bg-gradient-to-br from-card to-accent/5"
      >
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-accent" />
            <CardTitle className="text-text-primary">
              March 2026 Monthly Report
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-text-tertiary mb-1">Total Saved</p>
              <p
                data-testid="report-saved"
                className="font-mono text-xl text-success"
              >
                $347
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary mb-1">Actions Taken</p>
              <p
                data-testid="report-actions"
                className="font-mono text-xl text-text-primary"
              >
                8
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm">
            <Share2 className="w-3.5 h-3.5 mr-1" />
            Share Report
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
