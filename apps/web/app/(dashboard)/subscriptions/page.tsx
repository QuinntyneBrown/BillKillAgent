"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Search, Tv, Image, Wifi, Dumbbell, Music, X } from "lucide-react";

const subscriptions = [
  {
    name: "Netflix Premium",
    category: "Streaming",
    cost: "$22.99/mo",
    valueScore: 82,
    usage: "high",
    usagePercent: 85,
    action: "Keep" as const,
    icon: Tv,
    flagged: false,
  },
  {
    name: "Adobe Creative Cloud",
    category: "Software",
    cost: "$54.99/mo",
    valueScore: 3,
    usage: "none",
    usagePercent: 0,
    action: "Cancel" as const,
    icon: Image,
    flagged: true,
  },
  {
    name: "Comcast Internet",
    category: "Utilities",
    cost: "$89.99/mo",
    valueScore: 92,
    usage: "high",
    usagePercent: 95,
    action: "Negotiate" as const,
    icon: Wifi,
    flagged: false,
  },
  {
    name: "Planet Fitness",
    category: "Health & Fitness",
    cost: "$24.99/mo",
    valueScore: 8,
    usage: "low",
    usagePercent: 12,
    action: "Cancel" as const,
    icon: Dumbbell,
    flagged: true,
  },
  {
    name: "Spotify Premium",
    category: "Streaming",
    cost: "$10.99/mo",
    valueScore: 95,
    usage: "high",
    usagePercent: 90,
    action: "Keep" as const,
    icon: Music,
    flagged: false,
  },
];

const filterCategories = [
  "All",
  "Streaming",
  "Software",
  "Utilities",
  "Insurance",
  "Flagged",
];

function getUsageColor(usage: string) {
  switch (usage) {
    case "high":
      return "bg-success";
    case "low":
      return "bg-error";
    case "none":
      return "bg-text-muted";
    default:
      return "bg-text-tertiary";
  }
}

function getActionBadgeVariant(action: string) {
  switch (action) {
    case "Keep":
      return "success" as const;
    case "Cancel":
      return "warning" as const;
    case "Negotiate":
      return "default" as const;
    default:
      return "secondary" as const;
  }
}

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  const filtered = subscriptions.filter((sub) => {
    if (search && !sub.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (activeFilter === "All") return true;
    if (activeFilter === "Flagged") return sub.flagged;
    return sub.category === activeFilter;
  });

  const selected = subscriptions.find((s) => s.name === selectedSub);

  return (
    <>
      <Header title="Subscriptions" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span
            data-testid="subscription-count"
            className="text-sm text-text-secondary"
          >
            {subscriptions.length} subscriptions
          </span>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            placeholder="Search subscriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filterCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 rounded-badge text-sm font-medium transition-colors ${
              activeFilter === cat
                ? "bg-accent text-white"
                : "bg-card-hover text-text-secondary border border-border-visible hover:bg-border-subtle"
            }`}
          >
            {cat}
            {cat === "Flagged" && (
              <span className="ml-1.5 text-xs">
                ({subscriptions.filter((s) => s.flagged).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div
          data-testid="subscription-table-header"
          className="grid grid-cols-[1fr_120px_120px_80px_100px] gap-4 px-5 py-3 border-b border-border-subtle text-xs font-medium text-text-muted uppercase tracking-wider"
        >
          <span>Service</span>
          <span>Cost</span>
          <span>Usage</span>
          <span>Value</span>
          <span>Action</span>
        </div>

        <div className="divide-y divide-border-subtle">
          {filtered.map((sub) => (
            <div
              key={sub.name}
              data-testid="subscription-row"
              onClick={() =>
                setSelectedSub(
                  selectedSub === sub.name ? null : sub.name
                )
              }
              className={`grid grid-cols-1 sm:grid-cols-[1fr_120px_120px_80px_100px] gap-4 px-5 py-4 cursor-pointer hover:bg-card-hover transition-colors ${
                sub.flagged ? "border-l-2 border-l-error" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-btn bg-card-hover flex items-center justify-center">
                  <sub.icon className="w-4 h-4 text-text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {sub.name}
                  </p>
                  <p className="text-xs text-text-tertiary">{sub.category}</p>
                </div>
              </div>
              <div
                data-testid="subscription-cost"
                className="flex items-center font-mono text-sm text-text-primary"
              >
                {sub.cost}
              </div>
              <div
                data-testid="usage-bar"
                className="flex items-center gap-2"
              >
                <Progress
                  value={sub.usagePercent}
                  className="h-1.5 flex-1"
                  indicatorColor={getUsageColor(sub.usage)}
                />
                <span className="text-xs text-text-tertiary capitalize">
                  {sub.usage}
                </span>
              </div>
              <div
                data-testid="value-score"
                className="flex items-center"
              >
                <span
                  className={`font-mono text-sm ${
                    sub.valueScore >= 70
                      ? "text-success"
                      : sub.valueScore >= 30
                        ? "text-accent"
                        : "text-error"
                  }`}
                >
                  {sub.valueScore}
                </span>
              </div>
              <div
                data-testid="action-badge"
                className="flex items-center"
              >
                <Badge variant={getActionBadgeVariant(sub.action)}>
                  {sub.action}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Detail Panel */}
      {selected && (
        <div data-testid="subscription-detail" className="mt-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-btn bg-card-hover flex items-center justify-center">
                  <selected.icon className="w-5 h-5 text-text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-text-primary">
                    {selected.name}
                  </h3>
                  <p className="text-sm text-text-tertiary">
                    {selected.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="p-2 hover:bg-card-hover rounded-btn"
              >
                <X className="w-4 h-4 text-text-tertiary" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-3 rounded-list-item bg-recessed">
                <p className="text-xs text-text-tertiary mb-1">Monthly Cost</p>
                <p className="font-mono text-lg text-text-primary">
                  {selected.cost}
                </p>
              </div>
              <div className="p-3 rounded-list-item bg-recessed">
                <p className="text-xs text-text-tertiary mb-1">Value Score</p>
                <p className="font-mono text-lg text-text-primary">
                  {selected.valueScore}/100
                </p>
              </div>
              <div className="p-3 rounded-list-item bg-recessed">
                <p className="text-xs text-text-tertiary mb-1">Usage</p>
                <p className="text-lg text-text-primary capitalize">
                  {selected.usage}
                </p>
              </div>
            </div>

            <div data-testid="usage-history" className="mb-4">
              <p className="text-sm text-text-secondary mb-2">Usage History</p>
              <div className="flex gap-1 items-end h-12">
                {[40, 65, 30, 80, 55, 70, 85, 60, 75, 90, 45, 82].map(
                  (v, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-accent/30 rounded-sm"
                      style={{ height: `${v}%` }}
                    />
                  )
                )}
              </div>
            </div>

            <div className="flex gap-3">
              {selected.action === "Cancel" && (
                <Button variant="destructive">Cancel Subscription</Button>
              )}
              {selected.action === "Negotiate" && (
                <Button variant="primary">Negotiate Rate</Button>
              )}
              {selected.action === "Keep" && (
                <>
                  <Button variant="secondary">Cancel</Button>
                  <Button variant="primary">Negotiate</Button>
                </>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
