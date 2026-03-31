"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { X, Phone, Sparkles } from "lucide-react";

const cancelActions = [
  {
    name: "Adobe Creative Cloud",
    savings: "$54.99/mo",
    defaultOn: true,
  },
  {
    name: "Planet Fitness",
    savings: "$24.99/mo",
    defaultOn: true,
  },
  {
    name: "Headspace",
    savings: "$12.99/mo",
    defaultOn: true,
  },
];

const negotiateActions = [
  {
    name: "Comcast Internet",
    savings: "~$35/mo",
    defaultOn: true,
  },
  {
    name: "Verizon Wireless",
    savings: "~$25/mo",
    defaultOn: true,
  },
  {
    name: "State Farm Insurance",
    savings: "~$38/mo",
    defaultOn: false,
  },
];

export default function ActionApprovalPage() {
  const allActions = [...cancelActions, ...negotiateActions];
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(allActions.map((a) => [a.name, a.defaultOn]))
  );

  const toggleAction = (name: string) => {
    setToggles((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const enabledCount = Object.values(toggles).filter(Boolean).length;

  return (
    <div className="flex flex-col">
      <h1 className="font-serif text-[32px] leading-tight text-text-primary mb-2 text-center">
        Review Recommended Actions
      </h1>
      <p className="text-text-secondary text-sm mb-6 text-center">
        Approve the actions you'd like us to take on your behalf.
      </p>

      <div className="flex items-center justify-between mb-6">
        <p data-testid="actions-count" className="text-sm text-text-tertiary">
          {enabledCount} actions selected
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            const allOn = Object.fromEntries(
              allActions.map((a) => [a.name, true])
            );
            setToggles(allOn);
          }}
        >
          Approve All
        </Button>
      </div>

      {/* Cancel Section */}
      <div data-testid="cancel-section" className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-btn bg-error/10 flex items-center justify-center">
            <X className="w-3.5 h-3.5 text-error" />
          </div>
          <h3 className="text-sm font-medium text-text-secondary">
            Cancel Subscriptions
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          {cancelActions.map((action) => (
            <Card
              key={action.name}
              data-testid="action-row"
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {action.name}
                </p>
                <p
                  data-testid="estimated-savings"
                  className="text-xs text-success mt-0.5"
                >
                  Save {action.savings}
                </p>
              </div>
              <Switch
                checked={toggles[action.name]}
                onCheckedChange={() => toggleAction(action.name)}
              />
            </Card>
          ))}
        </div>
      </div>

      {/* Negotiate Section */}
      <div data-testid="negotiate-section" className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-btn bg-accent-tint flex items-center justify-center">
            <Phone className="w-3.5 h-3.5 text-accent" />
          </div>
          <h3 className="text-sm font-medium text-text-secondary">
            Negotiate Bills
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          {negotiateActions.map((action) => (
            <Card
              key={action.name}
              data-testid="action-row"
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {action.name}
                </p>
                <p
                  data-testid="estimated-savings"
                  className="text-xs text-success mt-0.5"
                >
                  Save {action.savings}
                </p>
              </div>
              <Switch
                checked={toggles[action.name]}
                onCheckedChange={() => toggleAction(action.name)}
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
