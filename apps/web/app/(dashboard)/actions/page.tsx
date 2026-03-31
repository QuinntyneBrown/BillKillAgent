"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  X,
  Phone,
  Sparkles,
  ArrowRight,
  Check,
  Clock,
  Loader2,
} from "lucide-react";

const pendingActions = [
  {
    name: "Cancel Adobe Creative Cloud",
    description:
      "No usage detected in 90 days. Cancellation will save you $54.99/mo.",
    savings: "$54.99/mo",
    type: "cancel",
    icon: X,
  },
  {
    name: "Cancel Planet Fitness",
    description:
      "Last visited 4 months ago. Membership cancellation saves $24.99/mo.",
    savings: "$24.99/mo",
    type: "cancel",
    icon: X,
  },
  {
    name: "Negotiate Comcast Internet",
    description:
      "Your rate is $30/mo above market average. AI negotiation can likely reduce it.",
    savings: "~$35/mo",
    type: "negotiate",
    icon: Phone,
  },
  {
    name: "Switch T-Mobile plan",
    description:
      "You're on an outdated plan. Switching to Essentials saves money with same features.",
    savings: "$15/mo",
    type: "switch",
    icon: Sparkles,
  },
];

const inProgressActions = [
  {
    name: "Negotiating State Farm Insurance",
    description: "AI agent is currently on hold with customer service.",
    savings: "~$38/mo",
    type: "negotiate",
    icon: Phone,
    status: "On hold with agent",
  },
  {
    name: "Cancelling Headspace",
    description: "Processing cancellation request with provider.",
    savings: "$12.99/mo",
    type: "cancel",
    icon: X,
    status: "Awaiting confirmation",
  },
];

const completedActions = [
  {
    name: "Verizon Wireless Negotiation",
    description: "Successfully reduced monthly rate from $85 to $60.",
    savings: "$25/mo",
    type: "negotiate",
    icon: Phone,
    outcome: "success",
  },
  {
    name: "Cancelled Hulu",
    description: "Subscription cancelled effective end of billing period.",
    savings: "$17.99/mo",
    type: "cancel",
    icon: X,
    outcome: "success",
  },
  {
    name: "AT&T Internet Negotiation",
    description: "Unable to secure a lower rate at this time.",
    savings: "$0/mo",
    type: "negotiate",
    icon: Phone,
    outcome: "failed",
  },
  {
    name: "Switched Sprint to T-Mobile",
    description: "Migrated to T-Mobile Essentials plan.",
    savings: "$20/mo",
    type: "switch",
    icon: Sparkles,
    outcome: "success",
  },
  {
    name: "Cancelled NYT Digital",
    description: "Subscription cancelled after free trial.",
    savings: "$17/mo",
    type: "cancel",
    icon: X,
    outcome: "success",
  },
  {
    name: "Negotiated Geico Auto",
    description: "Reduced premium by bundling policies.",
    savings: "$28/mo",
    type: "negotiate",
    icon: Phone,
    outcome: "success",
  },
  {
    name: "Cancelled Peloton",
    description: "App membership cancelled.",
    savings: "$12.99/mo",
    type: "cancel",
    icon: X,
    outcome: "success",
  },
  {
    name: "Switched Electric Provider",
    description: "Moved to green energy plan with lower rate.",
    savings: "$15/mo",
    type: "switch",
    icon: Sparkles,
    outcome: "success",
  },
  {
    name: "Negotiated Cox Internet",
    description: "Loyalty discount applied for 12 months.",
    savings: "$20/mo",
    type: "negotiate",
    icon: Phone,
    outcome: "success",
  },
  {
    name: "Cancelled ClassPass",
    description: "Membership cancelled, no penalty.",
    savings: "$49/mo",
    type: "cancel",
    icon: X,
    outcome: "success",
  },
  {
    name: "Cancelled LinkedIn Premium",
    description: "Downgraded to free tier.",
    savings: "$29.99/mo",
    type: "cancel",
    icon: X,
    outcome: "success",
  },
  {
    name: "Negotiated Spectrum TV",
    description: "Promotional rate extended for 6 months.",
    savings: "$30/mo",
    type: "negotiate",
    icon: Phone,
    outcome: "success",
  },
];

function getIconBg(type: string) {
  switch (type) {
    case "cancel":
      return "bg-error/10 text-error";
    case "negotiate":
      return "bg-accent-tint text-accent";
    case "switch":
      return "bg-success/10 text-success";
    default:
      return "bg-card-hover text-text-secondary";
  }
}

export default function ActionsPage() {
  const [tab, setTab] = useState("pending");

  return (
    <>
      <Header title="Action Queue" />

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-secondary">
          Review and approve recommended actions
        </p>
        <Button variant="primary">Approve All</Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full">
          <TabsTrigger value="pending">
            Pending Approval
            <span
              data-testid="tab-badge"
              className="ml-2 px-1.5 py-0.5 bg-accent-tint text-accent text-[11px] rounded-badge font-medium"
            >
              {pendingActions.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress
            <span
              data-testid="tab-badge"
              className="ml-2 px-1.5 py-0.5 bg-accent-tint text-accent text-[11px] rounded-badge font-medium"
            >
              {inProgressActions.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <span
              data-testid="tab-badge"
              className="ml-2 px-1.5 py-0.5 bg-accent-tint text-accent text-[11px] rounded-badge font-medium"
            >
              {completedActions.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="flex flex-col gap-3">
            {pendingActions.map((action) => (
              <Card
                key={action.name}
                data-testid="action-item"
                className="flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-btn flex items-center justify-center shrink-0 ${getIconBg(action.type)}`}
                >
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">
                    {action.name}
                  </p>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    {action.description}
                  </p>
                </div>
                <div
                  data-testid="action-savings"
                  className="font-mono text-sm text-success shrink-0"
                >
                  {action.savings}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="primary" size="sm">
                    Approve
                  </Button>
                  <Button variant="ghost" size="sm">
                    Dismiss
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="in-progress">
          <div className="flex flex-col gap-3">
            {inProgressActions.map((action) => (
              <Card
                key={action.name}
                data-testid="action-item"
                className="flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-btn flex items-center justify-center shrink-0 ${getIconBg(action.type)}`}
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">
                    {action.name}
                  </p>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    {action.description}
                  </p>
                </div>
                <div
                  data-testid="action-savings"
                  className="font-mono text-sm text-success shrink-0"
                >
                  {action.savings}
                </div>
                <div
                  data-testid="action-status"
                  className="flex items-center gap-1.5 shrink-0"
                >
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs text-text-secondary">
                    {action.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="flex flex-col gap-3">
            {completedActions.map((action) => (
              <Card
                key={action.name}
                data-testid="action-item"
                className="flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-btn flex items-center justify-center shrink-0 ${
                    action.outcome === "success"
                      ? "bg-success/10 text-success"
                      : "bg-error/10 text-error"
                  }`}
                >
                  {action.outcome === "success" ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">
                    {action.name}
                  </p>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    {action.description}
                  </p>
                </div>
                <div
                  data-testid="action-savings"
                  className="font-mono text-sm text-success shrink-0"
                >
                  {action.savings}
                </div>
                <div data-testid="action-status">
                  <Badge
                    variant={
                      action.outcome === "success" ? "success" : "warning"
                    }
                  >
                    {action.outcome === "success" ? "Completed" : "Failed"}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
