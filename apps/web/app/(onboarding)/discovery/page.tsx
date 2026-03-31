"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, AlertTriangle, Phone, Sparkles } from "lucide-react";

export default function SavingsDiscoveryPage() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-6">
        <Sparkles className="w-8 h-8 text-accent mx-auto mb-3" />
        <p className="text-text-secondary text-sm">We found</p>
      </div>

      <p
        data-testid="hero-savings-amount"
        className="font-mono text-[56px] leading-none text-success mb-2"
      >
        $347/mo
      </p>

      <p className="text-text-secondary text-sm mb-10">
        in potential savings
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-10">
        <Card
          data-testid="subscriptions-found-card"
          className="flex flex-col items-center py-5"
        >
          <div className="w-10 h-10 rounded-btn bg-accent-tint flex items-center justify-center mb-3">
            <CreditCard className="w-5 h-5 text-accent" />
          </div>
          <CardContent className="text-center p-0">
            <p className="font-mono text-xl text-text-primary">14</p>
            <p className="text-xs text-text-tertiary mt-1">
              Subscriptions Found
            </p>
          </CardContent>
        </Card>

        <Card
          data-testid="waste-detected-card"
          className="flex flex-col items-center py-5"
        >
          <div className="w-10 h-10 rounded-btn bg-error/10 flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5 text-error" />
          </div>
          <CardContent className="text-center p-0">
            <p className="font-mono text-xl text-text-primary">$80/mo</p>
            <p className="text-xs text-text-tertiary mt-1">Waste Detected</p>
          </CardContent>
        </Card>

        <Card
          data-testid="negotiations-possible-card"
          className="flex flex-col items-center py-5"
        >
          <div className="w-10 h-10 rounded-btn bg-success/10 flex items-center justify-center mb-3">
            <Phone className="w-5 h-5 text-success" />
          </div>
          <CardContent className="text-center p-0">
            <p className="font-mono text-xl text-text-primary">4</p>
            <p className="text-xs text-text-tertiary mt-1">
              Negotiations Possible
            </p>
          </CardContent>
        </Card>
      </div>

      <Button variant="primary" size="lg" className="w-full max-w-xs">
        Review &amp; Save
      </Button>
    </div>
  );
}
