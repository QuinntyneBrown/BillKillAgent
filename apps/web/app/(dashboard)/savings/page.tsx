"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowRight, Landmark } from "lucide-react";

const cumulativeData = [
  { month: "Oct", achieved: 2100, projected: 2100 },
  { month: "Nov", achieved: 2500, projected: 2600 },
  { month: "Dec", achieved: 2900, projected: 3100 },
  { month: "Jan", achieved: 3300, projected: 3600 },
  { month: "Feb", achieved: 3700, projected: 4200 },
  { month: "Mar", achieved: 4128, projected: 4800 },
];

const categories = [
  { name: "Subscriptions", amount: "$1,840", color: "#FF5C00", percent: 45 },
  { name: "Negotiations", amount: "$1,488", color: "#22C55E", percent: 36 },
  { name: "Plan Switches", amount: "$800", color: "#3B82F6", percent: 19 },
];

const transfers = [
  {
    date: "Mar 28, 2026",
    amount: "$347.00",
    destination: "Fidelity Roth IRA",
    status: "Completed",
  },
  {
    date: "Feb 28, 2026",
    amount: "$312.00",
    destination: "Fidelity Roth IRA",
    status: "Completed",
  },
  {
    date: "Jan 28, 2026",
    amount: "$298.00",
    destination: "Fidelity Roth IRA",
    status: "Completed",
  },
];

export default function SavingsPage() {
  const [showProjected, setShowProjected] = useState(true);

  return (
    <>
      <Header title="Savings Tracker" />

      {/* Header summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-section-gap">
        <div>
          <p
            data-testid="savings-destination"
            className="text-sm text-text-secondary mb-1"
          >
            Savings auto-transferred to{" "}
            <span className="text-accent">Fidelity Roth IRA</span>
          </p>
        </div>
        <div
          data-testid="lifetime-savings"
          className="flex items-center gap-2"
        >
          <span className="text-sm text-text-tertiary">Lifetime Total:</span>
          <span className="font-mono text-2xl text-success">$4,128</span>
        </div>
      </div>

      {/* Monthly/Annual breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-card-gap mb-section-gap">
        <Card data-testid="monthly-savings">
          <CardHeader>
            <CardTitle>Monthly Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-mono text-[28px] leading-none text-text-primary">
              $347/mo
            </span>
          </CardContent>
        </Card>
        <Card data-testid="annual-savings">
          <CardHeader>
            <CardTitle>Annual Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-mono text-[28px] leading-none text-text-primary">
              $4,164/yr
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Chart + Category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-card-gap mb-section-gap">
        <Card className="lg:col-span-2" data-testid="cumulative-savings-chart">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Cumulative Savings</CardTitle>
              <div className="flex gap-1">
                <button
                  onClick={() => setShowProjected(false)}
                  className={`px-3 py-1 text-xs font-medium rounded-btn transition-colors ${
                    !showProjected
                      ? "bg-success text-white"
                      : "text-text-tertiary hover:text-text-secondary hover:bg-card-hover"
                  }`}
                >
                  Achieved
                </button>
                <button
                  onClick={() => setShowProjected(true)}
                  className={`px-3 py-1 text-xs font-medium rounded-btn transition-colors ${
                    showProjected
                      ? "bg-success text-white"
                      : "text-text-tertiary hover:text-text-secondary hover:bg-card-hover"
                  }`}
                >
                  Projected
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cumulativeData}>
                  <defs>
                    <linearGradient
                      id="achievedGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#22C55E"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="projectedGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                      <stop
                        offset="95%"
                        stopColor="#3B82F6"
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
                    formatter={(value: number, name: string) => [
                      `$${value}`,
                      name === "achieved" ? "Achieved" : "Projected",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="achieved"
                    stroke="#22C55E"
                    strokeWidth={2}
                    fill="url(#achievedGradient)"
                  />
                  {showProjected && (
                    <Area
                      type="monotone"
                      dataKey="projected"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fill="url(#projectedGradient)"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card data-testid="category-breakdown">
          <CardHeader>
            <CardTitle>By Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {categories.map((cat) => (
                <div key={cat.name} data-testid="category-row">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-sm text-text-primary">
                        {cat.name}
                      </span>
                    </div>
                    <span
                      data-testid="category-amount"
                      className="font-mono text-sm text-text-primary"
                    >
                      {cat.amount}
                    </span>
                  </div>
                  <div className="h-1.5 bg-recessed rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${cat.percent}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transfer History */}
      <Card data-testid="transfer-history">
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border-subtle">
            {transfers.map((transfer, i) => (
              <div
                key={i}
                data-testid="transfer-row"
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-btn bg-success/10 flex items-center justify-center">
                    <Landmark className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {transfer.destination}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {transfer.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-success">
                    +{transfer.amount}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {transfer.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
