/**
 * v2.1 pricing tiers — demo mode. Shared between the create-flow
 * checkout step (PricingPicker) and the standalone /pricing page.
 */
export interface PricingTier {
  id: "single" | "three-pack" | "season";
  name: string;
  price: string;
  priceValue: number;
  tagline: string;
  desc: string;
  features: string[];
  /** Flat, guaranteed rescue pledge for this plan — never "profits if any." */
  pledge: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "single",
    name: "Single Episode",
    price: "$4.99",
    priceValue: 4.99,
    tagline: "One episode, on a loop",
    desc: "Good for testing it out — about a minute of continuous cartoon, built to loop seamlessly for as long as your dog wants to watch.",
    features: ["1 episode — about a minute, loops seamlessly", "One free preview retry", "$1.00 goes to dog rescues"],
    pledge: "$1.00",
  },
  {
    id: "three-pack",
    name: "Three-Episode Pack",
    price: "$9.99",
    priceValue: 9.99,
    tagline: "Three adventures, three weeks",
    desc: "Pick three different themes. Three weeks of your dog on TV — better value, great for gifts.",
    features: ["3 episodes, one per week", "Mix and match themes", "$2.50 goes to dog rescues"],
    pledge: "$2.50",
  },
  {
    id: "season",
    name: "Season Pass",
    price: "$19.99",
    priceValue: 19.99,
    tagline: "6 episodes over 6 weeks",
    desc: "A premiere episode plus five weekly adventures — a new adventure appears automatically every Friday for six weeks.",
    features: ["6 episodes: 1 premiere + 5 weekly adventures", "New episode auto-appears weekly", "$5.00 goes to dog rescues"],
    pledge: "$5.00",
  },
];
