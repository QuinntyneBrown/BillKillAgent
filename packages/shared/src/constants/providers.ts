export interface ProviderInfo {
  name: string;
  slug: string;
  category: string;
  cancellationMethods: string[];
  negotiable: boolean;
  averageSavingsPercent: number;
  logoUrl: string | null;
}

export const PROVIDERS: ProviderInfo[] = [
  {
    name: "Netflix",
    slug: "netflix",
    category: "streaming",
    cancellationMethods: ["portal"],
    negotiable: false,
    averageSavingsPercent: 0,
    logoUrl: null,
  },
  {
    name: "Adobe Creative Cloud",
    slug: "adobe-cc",
    category: "software",
    cancellationMethods: ["chat", "phone"],
    negotiable: true,
    averageSavingsPercent: 25,
    logoUrl: null,
  },
  {
    name: "Comcast Xfinity",
    slug: "comcast",
    category: "internet",
    cancellationMethods: ["phone", "chat"],
    negotiable: true,
    averageSavingsPercent: 30,
    logoUrl: null,
  },
  {
    name: "Planet Fitness",
    slug: "planet-fitness",
    category: "fitness",
    cancellationMethods: ["email", "portal"],
    negotiable: false,
    averageSavingsPercent: 0,
    logoUrl: null,
  },
  {
    name: "Spotify",
    slug: "spotify",
    category: "music",
    cancellationMethods: ["portal"],
    negotiable: false,
    averageSavingsPercent: 0,
    logoUrl: null,
  },
  {
    name: "Hulu",
    slug: "hulu",
    category: "streaming",
    cancellationMethods: ["portal"],
    negotiable: false,
    averageSavingsPercent: 0,
    logoUrl: null,
  },
  {
    name: "AT&T",
    slug: "att",
    category: "internet",
    cancellationMethods: ["phone", "chat"],
    negotiable: true,
    averageSavingsPercent: 20,
    logoUrl: null,
  },
  {
    name: "Verizon",
    slug: "verizon",
    category: "internet",
    cancellationMethods: ["phone", "chat"],
    negotiable: true,
    averageSavingsPercent: 18,
    logoUrl: null,
  },
];
