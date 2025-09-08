// Centralized brand config. Replace values with your approved brand palette and stats.

export const BRAND = {
  name: "ALAIN AI Learning Platform",
  colors: {
    primary: process.env.NEXT_PUBLIC_BRAND_PRIMARY || "#2563eb", // blue-600
    accent: process.env.NEXT_PUBLIC_BRAND_ACCENT || "#14b8a6",  // teal-500
    spark: process.env.NEXT_PUBLIC_BRAND_SPARK || "#22d3ee",    // cyan-400
  },
  logoSrc: "/logo.svg", // set to your asset path if available
  stats: {
    // Provide approved, truthful figures via env or here.
    users: process.env.NEXT_PUBLIC_STATS_USERS || "", // e.g., "5,000+"
    lessons: process.env.NEXT_PUBLIC_STATS_LESSONS || "", // e.g., "12,000+"
    models: process.env.NEXT_PUBLIC_STATS_MODELS || "", // e.g., "1,200+"
  },
};

export function formattedStats() {
  const u = BRAND.stats.users?.trim();
  const l = BRAND.stats.lessons?.trim();
  const m = BRAND.stats.models?.trim();
  return {
    users: u ? `Trusted by ${u} developers` : "Trusted by developers",
    lessons: l ? `${l} lessons generated` : "Interactive lessons generated",
    models: m ? `${m} models supported` : "Models supported",
  } as const;
}

