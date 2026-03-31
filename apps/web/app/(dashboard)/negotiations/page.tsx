"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Phone, ArrowRight } from "lucide-react";

const negotiations = [
  {
    provider: "Verizon Wireless",
    date: "Mar 28, 2026",
    originalRate: "$85/mo",
    newRate: "$60/mo",
    savings: "$25/mo",
    outcome: "success" as const,
  },
  {
    provider: "State Farm Insurance",
    date: "Mar 15, 2026",
    originalRate: "$180/mo",
    newRate: "$142/mo",
    savings: "$38/mo",
    outcome: "success" as const,
  },
  {
    provider: "AT&T Internet",
    date: "Mar 10, 2026",
    originalRate: "$75/mo",
    newRate: "$75/mo",
    savings: "$0/mo",
    outcome: "failed" as const,
  },
  {
    provider: "Comcast Cable",
    date: "Feb 28, 2026",
    originalRate: "$120/mo",
    newRate: "$89/mo",
    savings: "$31/mo",
    outcome: "success" as const,
  },
  {
    provider: "Geico Auto Insurance",
    date: "Feb 15, 2026",
    originalRate: "$165/mo",
    newRate: "$137/mo",
    savings: "$28/mo",
    outcome: "success" as const,
  },
];

export default function NegotiationsPage() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const selected = negotiations.find((n) => n.provider === selectedProvider);

  const successCount = negotiations.filter((n) => n.outcome === "success").length;
  const successRate = Math.round((successCount / negotiations.length) * 100);
  const totalSaved = negotiations
    .filter((n) => n.outcome === "success")
    .reduce((acc, n) => acc + parseInt(n.savings.replace(/[^0-9]/g, "")), 0);

  return (
    <>
      <Header title="Negotiations" />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-card-gap mb-section-gap">
        <Card data-testid="stat-total-negotiations">
          <CardHeader>
            <CardTitle>Total Negotiations</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-mono text-[32px] leading-none text-text-primary">
              18
            </span>
          </CardContent>
        </Card>

        <Card data-testid="stat-success-rate">
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-mono text-[32px] leading-none text-success">
              72%
            </span>
          </CardContent>
        </Card>

        <Card data-testid="stat-total-saved">
          <CardHeader>
            <CardTitle>Total Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-mono text-[32px] leading-none text-accent">
              $482/mo
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Negotiation Rows */}
      <Card className="p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle">
          <h3 className="text-sm font-medium text-text-secondary">
            Negotiation History
          </h3>
        </div>
        <div className="divide-y divide-border-subtle">
          {negotiations.map((neg) => (
            <div
              key={neg.provider}
              data-testid="negotiation-row"
              onClick={() =>
                setSelectedProvider(
                  selectedProvider === neg.provider ? null : neg.provider
                )
              }
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 py-4 cursor-pointer hover:bg-card-hover transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={`w-9 h-9 rounded-btn flex items-center justify-center shrink-0 ${
                    neg.outcome === "success"
                      ? "bg-success/10 text-success"
                      : "bg-error/10 text-error"
                  }`}
                >
                  {neg.outcome === "success" ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {neg.provider}
                  </p>
                  <p className="text-xs text-text-tertiary">{neg.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  data-testid="original-rate"
                  className="font-mono text-sm text-text-tertiary line-through"
                >
                  {neg.originalRate}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                <span
                  data-testid="new-rate"
                  className="font-mono text-sm text-text-primary"
                >
                  {neg.newRate}
                </span>
              </div>

              <div data-testid="outcome-badge">
                <Badge
                  variant={
                    neg.outcome === "success" ? "success" : "warning"
                  }
                >
                  {neg.savings}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Detail Panel */}
      {selected && (
        <div data-testid="negotiation-detail" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-btn bg-accent-tint flex items-center justify-center">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-text-primary">
                      {selected.provider}
                    </h3>
                    <p className="text-sm text-text-tertiary">
                      {selected.date}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="p-2 hover:bg-card-hover rounded-btn"
                >
                  <X className="w-4 h-4 text-text-tertiary" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 rounded-list-item bg-recessed">
                  <p className="text-xs text-text-tertiary mb-1">
                    Original Rate
                  </p>
                  <p className="font-mono text-lg text-text-primary">
                    {selected.originalRate}
                  </p>
                </div>
                <div className="p-3 rounded-list-item bg-recessed">
                  <p className="text-xs text-text-tertiary mb-1">New Rate</p>
                  <p className="font-mono text-lg text-text-primary">
                    {selected.newRate}
                  </p>
                </div>
                <div className="p-3 rounded-list-item bg-recessed">
                  <p className="text-xs text-text-tertiary mb-1">Savings</p>
                  <p className="font-mono text-lg text-success">
                    {selected.savings}
                  </p>
                </div>
              </div>

              <div data-testid="transcript">
                <h4 className="text-sm font-medium text-text-secondary mb-3">
                  Negotiation Transcript
                </h4>
                <div className="space-y-3 p-4 rounded-list-item bg-recessed">
                  <div className="flex gap-3">
                    <span className="text-xs text-accent font-medium shrink-0">
                      AI Agent:
                    </span>
                    <p className="text-sm text-text-secondary">
                      Hello, I'm calling on behalf of a customer regarding their
                      current {selected.provider} plan rate.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xs text-text-tertiary font-medium shrink-0">
                      Rep:
                    </span>
                    <p className="text-sm text-text-secondary">
                      I'd be happy to help review the account. Let me pull up
                      the details.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xs text-accent font-medium shrink-0">
                      AI Agent:
                    </span>
                    <p className="text-sm text-text-secondary">
                      The customer has been a loyal member for over 3 years and
                      we've noticed competitive rates in the market.
                      {selected.outcome === "success"
                        ? " We were able to negotiate a better rate."
                        : " Unfortunately no discount was available at this time."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
