/**
 * v2.1 charity + ledger data — demo mode, sample data only.
 * Shared by the homepage ledger teaser, the create-flow charity
 * picker, and the standalone /impact page.
 */
export interface Charity {
  id: string;
  name: string;
  location: string;
  blurb: string;
}

export const CHARITIES: Charity[] = [
  {
    id: "second-chance",
    name: "Second Chance Ranch Rescue",
    location: "Ennis, TX",
    blurb: "Large-breed rescue, fostering, and rehab.",
  },
  {
    id: "lone-star-bully",
    name: "Lone Star Bully Rescue",
    location: "Fort Worth, TX",
    blurb: "Bully-breed fostering and adoption.",
  },
  {
    id: "paws-hearts",
    name: "Paws & Hearts Sanctuary",
    location: "Denton, TX",
    blurb: "Senior and special-needs dogs.",
  },
  {
    id: "choose-for-me",
    name: "Let PupTV choose",
    location: "",
    blurb: "We'll route your donation to whichever partner rescue needs it most that week.",
  },
];

export const LEDGER_STATS = [
  { label: "Episodes created", value: "128" },
  { label: "Raised for rescues", value: "$384" },
  { label: "Shelters funded", value: "6" },
];

export interface LedgerRow {
  date: string;
  dog: string;
  order: string;
  amount: string;
  rescue: string;
}

export const LEDGER_ROWS: LedgerRow[] = [
  { date: "Jul 28, 2026", dog: "Dutch", order: "Single Episode", amount: "$1.00", rescue: "Second Chance Ranch Rescue" },
  { date: "Jul 24, 2026", dog: "Luna", order: "Season Pass", amount: "$5.00", rescue: "Paws & Hearts Sanctuary" },
  { date: "Jul 21, 2026", dog: "Bailey", order: "Three-Episode Pack", amount: "$2.50", rescue: "Lone Star Bully Rescue" },
  { date: "Jul 17, 2026", dog: "Max", order: "Single Episode", amount: "$1.00", rescue: "Second Chance Ranch Rescue" },
  { date: "Jul 12, 2026", dog: "Rosie", order: "Season Pass", amount: "$5.00", rescue: "Lone Star Bully Rescue" },
  { date: "Jul 08, 2026", dog: "Cooper", order: "Three-Episode Pack", amount: "$2.50", rescue: "Paws & Hearts Sanctuary" },
  { date: "Jul 03, 2026", dog: "Daisy", order: "Single Episode", amount: "$1.00", rescue: "Second Chance Ranch Rescue" },
];

export const IMPACT_RECEIPT = {
  dog: "Dutch",
  rescue: "Second Chance Ranch Rescue",
  impact: "2 vaccinations",
};
