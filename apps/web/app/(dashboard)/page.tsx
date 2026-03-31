"use client";

import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Check,
  X,
  Phone,
  CreditCard,
  Sparkles,
  PiggyBank,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const chartData6M = [
  { month: "Oct", savings: 620 },
  { month: "Nov", savings: 780 },
  { month: "Dec", savings: 850 },
  { month: "Jan", savings: 940 },
  { month: "Feb", savings: 1080 },
  { month: "Mar", savings: 1204 },
];

const chartData1Y = [
  { month: "Apr", savings: 120 },
  { month: "May", savings: 210 },
  { month: "Jun", savings: 340 },
  { month: "Jul", savings: 420 },
  { month: "Aug", savings: 510 },
  { month: "Sep", savings: 560 },
  ...chartData6M,
];

const chartDataAll = [
  { month: "Jan '25", savings: 0 },
  { month: "Mar", savings: 80 },
  { month: "May", savings: 210 },
  { month: "Jul", savings: 420 },
  { month: "Sep", savings: 560 },
  { month: "Nov", savings: 780 },
  { month: "Jan '26", savings: 940 },
  { month: "Mar", savings: 1204 },
];

const pendingActions = [
  { name: "Cancel Hulu", savings: "$17.99/mo", type: "cancel" },
  { name: "Negotiate Comcast", savings: "~$35/mo", type: "negotiate" },
  { name: "Switch T-Mobile plan", savings: "$15/mo", type: "switch" },
];

const activityItems = [
  {
    icon: Check,
    iconColor: "text-success",
    title: "Verizon bill reduced",
    desc: "Saved $25/mo on your wireless plan",
    time: "2h ago",
  },
  {
    icon: Phone,
    iconColor: "text-accent",
    title: "Negotiation started",
    desc: "Contacting State Farm Insurance",
    time: "5h ago",
  },
  {
    icon: X,
    iconColor: "text-error",
    title: "Cancelled Headspace",
    desc: "Annual savings: $69.99",
    time: "1d ago",
  },
  {
    icon: CreditCard,
    iconColor: "text-text-secondary",
    title: "New subscription detected",
    desc: "Disney+ added for $13.99/mo",
    time: "2d ago",
  },
];

type TimePeriod = "6M" | "1Y" | "ALL";

export default function DashboardPage() {
  const [period, setPeriod] = useState<TimePeriod>("6M");

  const chartDataMap: Record<TimePeriod, typeof chartData6M> = {
    "6M": chartData6M,
    "1Y": chartData1Y,
    ALL: chartDataAll,
  };

  return (
    <>
      <Header title="Dashboard" />

      <p
        data-testid="welcome-message"
        className="text-text-secondary text-sm -mt-2 mb-6"
      >
        Welcome back, Alex
      </p>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-card-gap mb-section-gap">
        <Card data-testid="metric-monthly-recurring">
          <CardHeader>
            <CardTitle>MONTHLY RECURRING</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <span
                data-testid="metric-value"
                className="font-mono text-[32px] leading-none text-text-primary"
              >
                $2,847
              </span>
              <span
                data-testid="metric-trend"
                className="flex items-center gap-1 text-error text-xs font-medium"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                +$142
              </span>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="metric-savings-found">
          <CardHeader>
            <CardTitle>SAVINGS FOUND</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <span
                data-testid="metric-value"
                className="font-mono text-[32px] leading-none text-text-primary"
              >
                $347
              </span>
              <span
                data-testid="metric-trend"
                className="flex items-center gap-1 text-success text-xs font-medium"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                +$52
              </span>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="metric-savings-achieved">
          <CardHeader>
            <CardTitle>SAVINGS ACHIEVED</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <span
                data-testid="metric-value"
                className="font-mono text-[32px] leading-none text-text-primary"
              >
                $1,204
              </span>
              <span
                data-testid="metric-trend"
                className="flex items-center gap-1 text-success text-xs font-medium"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                +$124
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart + Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-card-gap">
        {/* Savings Chart */}
        <Card className="lg:col-span-2" data-testid="savings-chart">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Savings Over Time</CardTitle>
              <div className="flex gap-1">
                {(["6M", "1Y", "ALL"] as TimePeriod[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1 text-xs font-medium rounded-btn transition-colors ${
                      period === p
                        ? "bg-accent text-white"
                        : "text-text-tertiary hover:text-text-secondary hover:bg-card-hover"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartDataMap[period]}>
                  <defs>
                    <linearGradient
                      id="savingsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#FF5C00" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#FF5C00"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1F1F23"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#4A4A4E"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#4A4A4E"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#141417",
                      border: "1px solid #1F1F23",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    formatter={(value: number) => [`$${value}`, "Savings"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="savings"
                    stroke="#FF5C00"
                    strokeWidth={2}
                    fill="url(#savingsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right Panel */}
        <div className="flex flex-col gap-card-gap">
          {/* Pending Actions */}
          <Card data-testid="pending-actions">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pending Actions</CardTitle>
                <Link
                  href="/actions"
                  className="text-xs text-accent hover:text-accent-light flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {pendingActions.map((action) => (
                  <div
                    key={action.name}
                    data-testid="action-preview"
                    className="flex items-center justify-between p-3 rounded-list-item bg-recessed"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-btn flex items-center justify-center ${
                          action.type === "cancel"
                            ? "bg-error/10 text-error"
                            : action.type === "negotiate"
                              ? "bg-accent-tint text-accent"
                              : "bg-success/10 text-success"
                        }`}
                      >
                        {action.type === "cancel" ? (
                          <X className="w-4 h-4" />
                        ) : action.type === "negotiate" ? (
                          <Phone className="w-4 h-4" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {action.name}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          Save {action.savings}
                        </p>
                      </div>
                    </div>
                    <Button variant="primary" size="sm">
                      Approve
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card data-testid="activity-feed">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {activityItems.map((item, i) => (
                  <div
                    key={i}
                    data-testid="activity-item"
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-btn bg-card-hover flex items-center justify-center shrink-0">
                      <item.icon
                        className={`w-4 h-4 ${item.iconColor}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">
                        {item.title}
                      </p>
                      <p className="text-xs text-text-tertiary">{item.desc}</p>
                    </div>
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
