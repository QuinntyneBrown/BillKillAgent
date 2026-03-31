export const SUBSCRIPTION_CATEGORIES = [
  "streaming",
  "software",
  "internet",
  "fitness",
  "music",
  "gaming",
  "news",
  "cloud_storage",
  "food_delivery",
  "productivity",
  "education",
  "insurance",
  "utilities",
  "other",
] as const;

export type SubscriptionCategory = (typeof SUBSCRIPTION_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<SubscriptionCategory, string> = {
  streaming: "Streaming",
  software: "Software",
  internet: "Internet & Cable",
  fitness: "Fitness",
  music: "Music",
  gaming: "Gaming",
  news: "News & Media",
  cloud_storage: "Cloud Storage",
  food_delivery: "Food Delivery",
  productivity: "Productivity",
  education: "Education",
  insurance: "Insurance",
  utilities: "Utilities",
  other: "Other",
};

export const CATEGORY_ICONS: Record<SubscriptionCategory, string> = {
  streaming: "tv",
  software: "code",
  internet: "wifi",
  fitness: "dumbbell",
  music: "music",
  gaming: "gamepad-2",
  news: "newspaper",
  cloud_storage: "cloud",
  food_delivery: "utensils",
  productivity: "briefcase",
  education: "graduation-cap",
  insurance: "shield",
  utilities: "zap",
  other: "circle-dot",
};
