"use client";

import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

export default function ScanningPage() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-card bg-accent/10 flex items-center justify-center mb-6">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>

      <h1 className="font-serif text-[32px] leading-tight text-text-primary mb-3">
        Scanning your transactions...
      </h1>

      <p className="text-text-secondary text-sm mb-8">
        This usually takes less than 2 minutes
      </p>

      {/* Progress Bar */}
      <div data-testid="scan-progress-bar" className="w-full max-w-sm mb-8">
        <Progress
          value={67}
          className="h-3"
        />
        <p
          data-testid="completion-percentage"
          className="text-sm text-text-secondary mt-2"
        >
          67% complete
        </p>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p
            data-testid="transactions-scanned"
            className="font-mono text-2xl text-text-primary"
          >
            1,847
          </p>
          <p className="text-xs text-text-tertiary">Transactions scanned</p>
        </div>
        <div>
          <p
            data-testid="subscriptions-found"
            className="font-mono text-2xl text-accent"
          >
            14
          </p>
          <p className="text-xs text-text-tertiary">Subscriptions found</p>
        </div>
      </div>
    </div>
  );
}
