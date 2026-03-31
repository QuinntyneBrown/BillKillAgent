"use client";

import { Button } from "@/components/ui/button";
import { ShieldCheck, Eye, Lock } from "lucide-react";

export default function ConnectBankPage() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-card bg-accent/10 flex items-center justify-center mb-6">
        <Lock className="w-8 h-8 text-accent" />
      </div>

      <h1 className="font-serif text-[32px] leading-tight text-text-primary mb-3">
        Connect Your Accounts
      </h1>

      <p className="text-text-secondary text-sm mb-4 max-w-sm">
        We use bank-grade encryption to securely scan your transactions and find
        savings opportunities.
      </p>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-badge bg-card border border-border-subtle text-xs text-text-secondary">
          <ShieldCheck className="w-3.5 h-3.5 text-success" />
          SOC 2 Certified
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-badge bg-card border border-border-subtle text-xs text-text-secondary">
          <Eye className="w-3.5 h-3.5 text-accent" />
          Read-Only Access
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-badge bg-card border border-border-subtle text-xs text-text-secondary">
          <ShieldCheck className="w-3.5 h-3.5 text-success" />
          GDPR &amp; CCPA
        </div>
      </div>

      <Button variant="primary" size="lg" className="w-full max-w-xs mb-4">
        Connect with Plaid
      </Button>

      <p className="text-xs text-text-muted">
        Supports 12,000+ financial institutions
      </p>
    </div>
  );
}
