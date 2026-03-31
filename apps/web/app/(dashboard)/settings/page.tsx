"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  Landmark,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const accounts = [
  { name: "Chase Sapphire", mask: "\u00b7\u00b7\u00b7\u00b74821", status: "Connected" },
  { name: "Bank of America", mask: "\u00b7\u00b7\u00b7\u00b77392", status: "Connected" },
];

type AutonomyLevel = "supervised" | "semi" | "full";

const autonomyOptions: {
  id: AutonomyLevel;
  label: string;
  desc: string;
}[] = [
  {
    id: "supervised",
    label: "Supervised",
    desc: "AI recommends actions, you approve each one.",
  },
  {
    id: "semi",
    label: "Semi-Autonomous",
    desc: "AI acts on cancellations, you approve negotiations.",
  },
  {
    id: "full",
    label: "Fully Autonomous",
    desc: "AI handles everything automatically. You get notified.",
  },
];

const notificationPrefs = [
  { label: "Push Notifications", defaultOn: true },
  { label: "Email Digests", defaultOn: true },
  { label: "Price Increase Alerts", defaultOn: true },
  { label: "Monthly Report", defaultOn: true },
  { label: "Negotiation Updates", defaultOn: false },
  { label: "New Subscription Detected", defaultOn: true },
];

export default function SettingsPage() {
  const [autonomy, setAutonomy] = useState<AutonomyLevel>("supervised");
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    Object.fromEntries(notificationPrefs.map((p) => [p.label, p.defaultOn]))
  );
  const [autoTransfer, setAutoTransfer] = useState(true);

  return (
    <>
      <Header title="Settings" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-card-gap">
        {/* Left Column */}
        <div className="flex flex-col gap-card-gap">
          {/* Connected Accounts */}
          <Card data-testid="connected-accounts">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Connected Accounts</CardTitle>
                <Button variant="ghost" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Account
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {accounts.map((account) => (
                  <div
                    key={account.name}
                    data-testid="account-row"
                    className="flex items-center justify-between p-3 rounded-list-item bg-recessed"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-btn bg-card-hover flex items-center justify-center">
                        <Landmark className="w-4 h-4 text-text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {account.name}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {account.mask}
                        </p>
                      </div>
                    </div>
                    <div
                      data-testid="account-status"
                      className="flex items-center gap-1.5"
                    >
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-xs text-success">
                        {account.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Autonomy Level */}
          <Card data-testid="autonomy-section">
            <CardHeader>
              <CardTitle>Autonomy Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {autonomyOptions.map((option) => (
                  <button
                    key={option.id}
                    data-testid={`autonomy-${option.id}`}
                    data-selected={autonomy === option.id ? "true" : "false"}
                    onClick={() => setAutonomy(option.id)}
                    className={`flex items-start gap-3 p-3 rounded-list-item text-left transition-colors ${
                      autonomy === option.id
                        ? "bg-accent-tint border border-accent"
                        : "bg-recessed border border-transparent hover:border-border-visible"
                    }`}
                  >
                    <div
                      className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        autonomy === option.id
                          ? "border-accent"
                          : "border-text-muted"
                      }`}
                    >
                      {autonomy === option.id && (
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {option.label}
                      </p>
                      <p className="text-xs text-text-tertiary mt-0.5">
                        {option.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-card-gap">
          {/* Notifications */}
          <Card data-testid="notifications-section">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                {notificationPrefs.map((pref) => (
                  <div
                    key={pref.label}
                    data-testid="notification-toggle-row"
                    className="flex items-center justify-between py-2.5"
                  >
                    <span className="text-sm text-text-primary">
                      {pref.label}
                    </span>
                    <Switch
                      checked={notifications[pref.label]}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          [pref.label]: checked,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Savings Destination */}
          <Card data-testid="savings-destination-section">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Savings Destination</CardTitle>
                <Button variant="ghost" size="sm">
                  Change
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 rounded-list-item bg-recessed mb-3">
                <div className="w-9 h-9 rounded-btn bg-success/10 flex items-center justify-center">
                  <Landmark className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Fidelity Roth IRA
                  </p>
                  <p className="text-xs text-text-tertiary">
                    ····9184
                  </p>
                </div>
              </div>
              <div
                data-testid="auto-transfer-toggle"
                className="flex items-center justify-between"
              >
                <span className="text-sm text-text-primary">
                  Auto-transfer savings
                </span>
                <Switch
                  checked={autoTransfer}
                  onCheckedChange={setAutoTransfer}
                />
              </div>
            </CardContent>
          </Card>

          {/* Profile */}
          <Card data-testid="profile-section">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-accent/20 text-accent text-base">
                    AJ
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p
                    data-testid="user-name"
                    className="text-base font-medium text-text-primary"
                  >
                    Alex Johnson
                  </p>
                  <p
                    data-testid="user-email"
                    className="text-sm text-text-tertiary"
                  >
                    test@billkill.app
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                <button className="flex items-center justify-between py-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Change Password
                  <ArrowRight className="w-4 h-4 text-text-muted" />
                </button>
                <button className="flex items-center justify-between py-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Log Out
                  <ArrowRight className="w-4 h-4 text-text-muted" />
                </button>
                <button className="flex items-center justify-between py-2.5 text-sm text-error hover:text-error/80 transition-colors">
                  Delete Account
                  <ArrowRight className="w-4 h-4 text-text-muted" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
