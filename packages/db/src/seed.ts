import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

const connectionString = process.env.DATABASE_URL ?? "postgresql://billkill:billkill@localhost:5432/billkill";
const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql, { schema });

async function seed() {
  console.log("Seeding database...");

  // Clean up existing data
  await db.delete(schema.transfers);
  await db.delete(schema.savingsDestinations);
  await db.delete(schema.savingsRecords);
  await db.delete(schema.negotiationSessions);
  await db.delete(schema.cancellationAttempts);
  await db.delete(schema.billingEvents);
  await db.delete(schema.notifications);
  await db.delete(schema.userNotificationPrefs);
  await db.delete(schema.wasteFlags);
  await db.delete(schema.actions);
  await db.delete(schema.subscriptions);
  await db.delete(schema.transactions);
  await db.delete(schema.accounts);
  await db.delete(schema.plaidItems);
  await db.delete(schema.providerFlows);
  await db.delete(schema.users);

  // Create user: Alex Johnson
  const [user] = await db
    .insert(schema.users)
    .values({
      email: "alex@example.com",
      name: "Alex Johnson",
      avatarUrl: null,
      autonomyLevel: "supervised",
      savingsThreshold: "50",
      premiumTier: "plus",
      onboardingCompleted: true,
    })
    .returning();

  console.log(`Created user: ${user.name} (${user.id})`);

  // Create subscriptions matching UI designs
  // Total recurring: $2,847/mo spread across subscriptions
  const [netflix] = await db
    .insert(schema.subscriptions)
    .values({
      userId: user.id,
      merchantName: "Netflix Premium",
      logoUrl: null,
      amount: "22.99",
      frequency: "monthly",
      category: "streaming",
      valueScore: 75,
      usageScore: 85,
      status: "active",
      recommendedAction: "keep",
      nextBillingDate: new Date("2026-04-15"),
    })
    .returning();

  const [adobe] = await db
    .insert(schema.subscriptions)
    .values({
      userId: user.id,
      merchantName: "Adobe Creative Cloud",
      logoUrl: null,
      amount: "54.99",
      frequency: "monthly",
      category: "software",
      valueScore: 40,
      usageScore: 25,
      status: "active",
      recommendedAction: "negotiate",
      nextBillingDate: new Date("2026-04-08"),
    })
    .returning();

  const [comcast] = await db
    .insert(schema.subscriptions)
    .values({
      userId: user.id,
      merchantName: "Comcast Xfinity",
      logoUrl: null,
      amount: "89.99",
      frequency: "monthly",
      category: "internet",
      valueScore: 55,
      usageScore: 90,
      status: "active",
      recommendedAction: "negotiate",
      nextBillingDate: new Date("2026-04-01"),
    })
    .returning();

  const [planetFitness] = await db
    .insert(schema.subscriptions)
    .values({
      userId: user.id,
      merchantName: "Planet Fitness",
      logoUrl: null,
      amount: "24.99",
      frequency: "monthly",
      category: "fitness",
      valueScore: 20,
      usageScore: 10,
      status: "active",
      recommendedAction: "cancel",
      nextBillingDate: new Date("2026-04-05"),
    })
    .returning();

  const [spotify] = await db
    .insert(schema.subscriptions)
    .values({
      userId: user.id,
      merchantName: "Spotify Premium",
      logoUrl: null,
      amount: "10.99",
      frequency: "monthly",
      category: "music",
      valueScore: 80,
      usageScore: 95,
      status: "active",
      recommendedAction: "keep",
      nextBillingDate: new Date("2026-04-12"),
    })
    .returning();

  // Additional subscriptions to reach ~$2,847 recurring total
  const additionalSubs = await db
    .insert(schema.subscriptions)
    .values([
      {
        userId: user.id,
        merchantName: "AWS",
        amount: "450.00",
        frequency: "monthly",
        category: "software",
        valueScore: 90,
        usageScore: 95,
        status: "active",
        recommendedAction: "keep",
        nextBillingDate: new Date("2026-04-01"),
      },
      {
        userId: user.id,
        merchantName: "Slack Business+",
        amount: "150.00",
        frequency: "monthly",
        category: "productivity",
        valueScore: 85,
        usageScore: 90,
        status: "active",
        recommendedAction: "keep",
        nextBillingDate: new Date("2026-04-01"),
      },
      {
        userId: user.id,
        merchantName: "GitHub Enterprise",
        amount: "231.00",
        frequency: "monthly",
        category: "software",
        valueScore: 90,
        usageScore: 85,
        status: "active",
        recommendedAction: "keep",
        nextBillingDate: new Date("2026-04-01"),
      },
      {
        userId: user.id,
        merchantName: "Figma Professional",
        amount: "75.00",
        frequency: "monthly",
        category: "software",
        valueScore: 70,
        usageScore: 60,
        status: "active",
        recommendedAction: "downgrade",
        nextBillingDate: new Date("2026-04-10"),
      },
      {
        userId: user.id,
        merchantName: "Hulu + Live TV",
        amount: "82.99",
        frequency: "monthly",
        category: "streaming",
        valueScore: 30,
        usageScore: 15,
        status: "active",
        recommendedAction: "cancel",
        nextBillingDate: new Date("2026-04-18"),
      },
      {
        userId: user.id,
        merchantName: "LinkedIn Premium",
        amount: "59.99",
        frequency: "monthly",
        category: "productivity",
        valueScore: 35,
        usageScore: 20,
        status: "active",
        recommendedAction: "cancel",
        nextBillingDate: new Date("2026-04-22"),
      },
      {
        userId: user.id,
        merchantName: "Google Workspace",
        amount: "288.00",
        frequency: "monthly",
        category: "productivity",
        valueScore: 95,
        usageScore: 98,
        status: "active",
        recommendedAction: "keep",
        nextBillingDate: new Date("2026-04-01"),
      },
      {
        userId: user.id,
        merchantName: "Zoom Pro",
        amount: "13.33",
        frequency: "monthly",
        category: "productivity",
        valueScore: 60,
        usageScore: 45,
        status: "active",
        recommendedAction: "review",
        nextBillingDate: new Date("2026-04-15"),
      },
      {
        userId: user.id,
        merchantName: "Dropbox Business",
        amount: "75.00",
        frequency: "monthly",
        category: "cloud_storage",
        valueScore: 25,
        usageScore: 10,
        status: "active",
        recommendedAction: "cancel",
        nextBillingDate: new Date("2026-04-07"),
      },
      {
        userId: user.id,
        merchantName: "New York Times",
        amount: "17.00",
        frequency: "monthly",
        category: "news",
        valueScore: 50,
        usageScore: 40,
        status: "active",
        recommendedAction: "negotiate",
        nextBillingDate: new Date("2026-04-20"),
      },
      {
        userId: user.id,
        merchantName: "AT&T Wireless",
        amount: "185.00",
        frequency: "monthly",
        category: "utilities",
        valueScore: 60,
        usageScore: 95,
        status: "active",
        recommendedAction: "negotiate",
        nextBillingDate: new Date("2026-04-03"),
      },
      {
        userId: user.id,
        merchantName: "Progressive Insurance",
        amount: "215.00",
        frequency: "monthly",
        category: "insurance",
        valueScore: 65,
        usageScore: 100,
        status: "active",
        recommendedAction: "negotiate",
        nextBillingDate: new Date("2026-04-01"),
      },
      {
        userId: user.id,
        merchantName: "Disney+",
        amount: "13.99",
        frequency: "monthly",
        category: "streaming",
        valueScore: 55,
        usageScore: 35,
        status: "active",
        recommendedAction: "review",
        nextBillingDate: new Date("2026-04-25"),
      },
      {
        userId: user.id,
        merchantName: "iCloud+",
        amount: "9.99",
        frequency: "monthly",
        category: "cloud_storage",
        valueScore: 70,
        usageScore: 80,
        status: "active",
        recommendedAction: "keep",
        nextBillingDate: new Date("2026-04-15"),
      },
    ])
    .returning();

  console.log(`Created ${5 + additionalSubs.length} subscriptions`);

  // Waste flags
  await db.insert(schema.wasteFlags).values([
    {
      subscriptionId: planetFitness.id,
      type: "unused",
      severity: "high",
      evidence: { lastUsed: "2025-11-15", usageFrequency: "0 visits in 4 months" },
    },
    {
      subscriptionId: adobe.id,
      type: "low_usage",
      severity: "medium",
      evidence: { averageMonthlyUsage: "2 hours", lastActive: "2026-02-10" },
    },
    {
      subscriptionId: additionalSubs[4].id, // Hulu
      type: "unused",
      severity: "high",
      evidence: { lastWatched: "2025-12-20", hoursWatched: "0 in last 3 months" },
    },
    {
      subscriptionId: additionalSubs[8].id, // Dropbox
      type: "duplicate",
      severity: "medium",
      evidence: { duplicateOf: "iCloud+", storageUsed: "2%" },
    },
  ]);

  console.log("Created waste flags");

  // Actions — pending, in-progress, completed
  // Pending action: cancel Planet Fitness ($24.99/mo savings)
  const [cancelPFAction] = await db
    .insert(schema.actions)
    .values({
      userId: user.id,
      subscriptionId: planetFitness.id,
      type: "cancel",
      status: "pending",
      estimatedSavings: "24.99",
      autonomyApproved: false,
    })
    .returning();

  // Pending action: cancel Hulu ($82.99/mo savings)
  const [cancelHuluAction] = await db
    .insert(schema.actions)
    .values({
      userId: user.id,
      subscriptionId: additionalSubs[4].id,
      type: "cancel",
      status: "pending",
      estimatedSavings: "82.99",
      autonomyApproved: false,
    })
    .returning();

  // Pending: cancel Dropbox ($75/mo)
  await db.insert(schema.actions).values({
    userId: user.id,
    subscriptionId: additionalSubs[8].id,
    type: "cancel",
    status: "pending",
    estimatedSavings: "75.00",
    autonomyApproved: false,
  });

  // In-progress: negotiate Comcast
  const [negotiateComcastAction] = await db
    .insert(schema.actions)
    .values({
      userId: user.id,
      subscriptionId: comcast.id,
      type: "negotiate",
      status: "in_progress",
      estimatedSavings: "25.00",
      autonomyApproved: true,
    })
    .returning();

  // In-progress: negotiate AT&T
  const [negotiateATTAction] = await db
    .insert(schema.actions)
    .values({
      userId: user.id,
      subscriptionId: additionalSubs[10].id,
      type: "negotiate",
      status: "in_progress",
      estimatedSavings: "35.00",
      autonomyApproved: true,
    })
    .returning();

  // Completed: negotiated Adobe (saved $15/mo)
  const [negotiateAdobeAction] = await db
    .insert(schema.actions)
    .values({
      userId: user.id,
      subscriptionId: adobe.id,
      type: "negotiate",
      status: "completed",
      estimatedSavings: "15.00",
      actualSavings: "15.00",
      autonomyApproved: true,
      completedAt: new Date("2026-02-15"),
    })
    .returning();

  // Completed: cancelled LinkedIn Premium ($59.99/mo)
  const [cancelLinkedInAction] = await db
    .insert(schema.actions)
    .values({
      userId: user.id,
      subscriptionId: additionalSubs[5].id,
      type: "cancel",
      status: "completed",
      estimatedSavings: "59.99",
      actualSavings: "59.99",
      autonomyApproved: true,
      completedAt: new Date("2026-01-20"),
    })
    .returning();

  // Completed: negotiated Progressive ($40/mo savings)
  const [negotiateProgressiveAction] = await db
    .insert(schema.actions)
    .values({
      userId: user.id,
      subscriptionId: additionalSubs[11].id,
      type: "negotiate",
      status: "completed",
      estimatedSavings: "40.00",
      actualSavings: "45.00",
      autonomyApproved: true,
      completedAt: new Date("2026-03-01"),
    })
    .returning();

  console.log("Created actions");

  // Cancellation attempts
  await db.insert(schema.cancellationAttempts).values({
    actionId: cancelLinkedInAction.id,
    method: "portal",
    status: "completed",
    attemptNumber: 1,
  });

  // Negotiation sessions
  await db.insert(schema.negotiationSessions).values([
    {
      actionId: negotiateAdobeAction.id,
      providerName: "Adobe Creative Cloud",
      originalRate: "54.99",
      newRate: "39.99",
      savings: "15.00",
      durationSeconds: 420,
      outcome: "success",
      transcript: [
        { role: "agent", text: "I'd like to discuss my Creative Cloud subscription pricing." },
        { role: "provider", text: "I can offer you a loyalty discount of 27% for the next 12 months." },
        { role: "agent", text: "That sounds great, I'll accept that offer." },
      ],
      retentionOffers: [
        { description: "27% loyalty discount for 12 months", discountPercent: 27, durationMonths: 12, accepted: true },
      ],
    },
    {
      actionId: negotiateComcastAction.id,
      providerName: "Comcast Xfinity",
      originalRate: "89.99",
      outcome: "in_progress",
      transcript: [],
      retentionOffers: [],
    },
    {
      actionId: negotiateProgressiveAction.id,
      providerName: "Progressive Insurance",
      originalRate: "215.00",
      newRate: "170.00",
      savings: "45.00",
      durationSeconds: 600,
      outcome: "success",
      transcript: [
        { role: "agent", text: "I'd like to review my auto insurance rate. I've been a customer for 3 years." },
        { role: "provider", text: "I can see your clean driving record. Let me check for available discounts." },
        { role: "provider", text: "I can apply a multi-policy discount and safe driver credit, bringing your rate to $170/month." },
        { role: "agent", text: "That's a great improvement, I'll accept." },
      ],
      retentionOffers: [
        { description: "Multi-policy + safe driver discount", discountPercent: 21, durationMonths: 6, accepted: true },
      ],
    },
  ]);

  console.log("Created negotiation sessions");

  // Savings records — total achieved: $1,204
  await db.insert(schema.savingsRecords).values([
    {
      userId: user.id,
      actionId: negotiateAdobeAction.id,
      amount: "180.00", // $15/mo * 12mo
      type: "negotiation",
      realizedAt: new Date("2026-02-15"),
    },
    {
      userId: user.id,
      actionId: cancelLinkedInAction.id,
      amount: "479.92", // $59.99 * ~8 months remaining
      type: "cancellation",
      realizedAt: new Date("2026-01-20"),
    },
    {
      userId: user.id,
      actionId: negotiateProgressiveAction.id,
      amount: "540.00", // $45/mo * 12mo
      type: "negotiation",
      realizedAt: new Date("2026-03-01"),
    },
  ]);

  // Savings destination
  const [savingsDest] = await db
    .insert(schema.savingsDestinations)
    .values({
      userId: user.id,
      accountName: "High-Yield Savings",
      accountMask: "4521",
      autoTransfer: true,
      transferFrequency: "monthly",
    })
    .returning();

  // Transfers
  await db.insert(schema.transfers).values([
    {
      userId: user.id,
      destinationId: savingsDest.id,
      amount: "180.00",
      status: "completed",
      initiatedAt: new Date("2026-02-20"),
      completedAt: new Date("2026-02-21"),
    },
    {
      userId: user.id,
      destinationId: savingsDest.id,
      amount: "479.92",
      status: "completed",
      initiatedAt: new Date("2026-01-25"),
      completedAt: new Date("2026-01-26"),
    },
    {
      userId: user.id,
      destinationId: savingsDest.id,
      amount: "540.00",
      status: "completed",
      initiatedAt: new Date("2026-03-05"),
      completedAt: new Date("2026-03-06"),
    },
  ]);

  console.log("Created savings records and transfers");

  // Notifications
  await db.insert(schema.notifications).values([
    {
      userId: user.id,
      type: "savings_found",
      title: "New savings opportunity found",
      body: "We detected that your Planet Fitness membership hasn't been used in 4 months. Cancel to save $24.99/mo.",
      severity: "warning",
      read: false,
      actionUrl: `/actions/${cancelPFAction.id}`,
    },
    {
      userId: user.id,
      type: "negotiation_complete",
      title: "Adobe CC rate reduced!",
      body: "We successfully negotiated your Adobe Creative Cloud subscription from $54.99 to $39.99/mo — saving you $15/mo.",
      severity: "success",
      read: true,
      actionUrl: `/actions/${negotiateAdobeAction.id}`,
    },
    {
      userId: user.id,
      type: "action_required",
      title: "Approve cancellation: Hulu + Live TV",
      body: "Hulu + Live TV costs $82.99/mo with no usage in 3 months. Approve cancellation to save $82.99/mo.",
      severity: "warning",
      read: false,
      actionUrl: `/actions/${cancelHuluAction.id}`,
    },
    {
      userId: user.id,
      type: "cancellation_complete",
      title: "LinkedIn Premium cancelled",
      body: "Your LinkedIn Premium subscription has been successfully cancelled. You'll save $59.99/mo going forward.",
      severity: "success",
      read: true,
      actionUrl: `/actions/${cancelLinkedInAction.id}`,
    },
    {
      userId: user.id,
      type: "negotiation_complete",
      title: "Progressive rate lowered!",
      body: "Your Progressive Insurance rate was reduced from $215/mo to $170/mo, saving you $45/mo.",
      severity: "success",
      read: false,
      actionUrl: `/actions/${negotiateProgressiveAction.id}`,
    },
  ]);

  // Notification preferences
  await db.insert(schema.userNotificationPrefs).values([
    { userId: user.id, channel: "in_app", eventType: "action_required", enabled: true },
    { userId: user.id, channel: "email", eventType: "action_required", enabled: true },
    { userId: user.id, channel: "push", eventType: "action_required", enabled: true },
    { userId: user.id, channel: "in_app", eventType: "savings_found", enabled: true },
    { userId: user.id, channel: "email", eventType: "savings_found", enabled: true },
    { userId: user.id, channel: "in_app", eventType: "negotiation_complete", enabled: true },
    { userId: user.id, channel: "email", eventType: "negotiation_complete", enabled: true },
    { userId: user.id, channel: "in_app", eventType: "cancellation_complete", enabled: true },
    { userId: user.id, channel: "email", eventType: "cancellation_complete", enabled: false },
    { userId: user.id, channel: "in_app", eventType: "price_alert", enabled: true },
    { userId: user.id, channel: "email", eventType: "price_alert", enabled: false },
    { userId: user.id, channel: "sms", eventType: "action_required", enabled: false },
  ]);

  console.log("Created notifications and preferences");

  // Provider flows
  await db.insert(schema.providerFlows).values([
    {
      providerName: "Comcast Xfinity",
      flowType: "negotiation",
      script: {
        steps: [
          { action: "call", prompt: "Request to speak with retention department" },
          { action: "state_intent", prompt: "Mention considering switching to competitor" },
          { action: "counter", prompt: "Ask for at least 25% discount on current rate" },
        ],
      },
      successRate: "72.50",
      lastVerified: new Date("2026-03-01"),
    },
    {
      providerName: "Adobe Creative Cloud",
      flowType: "negotiation",
      script: {
        steps: [
          { action: "chat", prompt: "Open chat support and request cancellation" },
          { action: "wait_for_offer", prompt: "Wait for retention offer" },
          { action: "counter", prompt: "Request at least 25% off" },
        ],
      },
      successRate: "65.00",
      lastVerified: new Date("2026-02-28"),
    },
    {
      providerName: "Planet Fitness",
      flowType: "cancellation",
      script: {
        steps: [
          { action: "email", prompt: "Send cancellation request to home club" },
          { action: "follow_up", prompt: "Follow up after 5 business days if no response" },
        ],
      },
      successRate: "95.00",
      lastVerified: new Date("2026-03-15"),
    },
  ]);

  console.log("Created provider flows");

  // Billing events
  await db.insert(schema.billingEvents).values([
    {
      userId: user.id,
      type: "subscription_created",
      amount: "9.99",
      stripeEventId: "evt_seed_001",
      createdAt: new Date("2026-01-01"),
    },
    {
      userId: user.id,
      type: "payment_succeeded",
      amount: "9.99",
      stripeEventId: "evt_seed_002",
      createdAt: new Date("2026-02-01"),
    },
    {
      userId: user.id,
      type: "payment_succeeded",
      amount: "9.99",
      stripeEventId: "evt_seed_003",
      createdAt: new Date("2026-03-01"),
    },
  ]);

  console.log("Created billing events");
  console.log("Seed complete!");

  await sql.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
