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
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "single",
    name: "Single Episode",
    price: "$4.99",
    priceValue: 4.99,
    tagline: "One 10-minute adventure",
    desc: "Good for testing it out. See what your dog looks like as a cartoon hero.",
    features: ["1 episode, about 10 minutes", "One free preview retry", "$1.00 goes to dog rescues"],
  },
  {
    id: "three-pack",
    name: "Three-Episode Pack",
    price: "$9.99",
    priceValue: 9.99,
    tagline: "Three adventures, three weeks",
    desc: "Pick three different themes. Three weeks of your dog on TV — better value, great for gifts.",
    features: ["3 episodes, one per week", "Mix and match themes", "$2.50 goes to dog rescues"],
  },
  {
    id: "season",
    name: "Season Pass",
    price: "$19.99",
    priceValue: 19.99,
    tagline: "Ten episodes, one per week",
    desc: "The full story arc — a new adventure appears automatically every Friday for ten weeks.",
    features: ["10 episodes over 10 weeks", "New episode auto-appears weekly", "$5.00 goes to dog rescues"],
  },
];
