"use client";

import { Zap, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {/* Logo */}
        <div data-testid="app-logo" className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-card bg-accent">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="font-mono text-xl font-medium tracking-wider text-text-primary">
            BILL KILL
          </span>
        </div>

        {/* Tagline */}
        <h1 className="font-serif text-[38px] leading-tight text-text-primary mb-3">
          Stop overpaying. Start saving.
        </h1>

        {/* Subtitle */}
        <p className="text-text-secondary text-sm mb-10 max-w-xs">
          Your AI agent that finds, cancels, and negotiates your bills to save
          you thousands.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full mb-8">
          <Button variant="primary" size="lg" className="w-full">
            <Mail className="w-4 h-4 mr-2" />
            Sign Up with Email
          </Button>
          <Button variant="secondary" size="lg" className="w-full">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
          <Button variant="secondary" size="lg" className="w-full">
            <svg
              className="w-4 h-4 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Continue with Apple
          </Button>
        </div>

        {/* Login link */}
        <p className="text-sm text-text-tertiary">
          Already have an account?{" "}
          <Link href="/" className="text-accent hover:text-accent-light">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
