import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Birthday Party Creative Planning Tool - Personalized Party Plan Generator",
  description: "Professional birthday party planning tool providing creative plans for children's birthdays, adult birthdays, and elder birthdays. Get your exclusive birthday party planning suggestions in minutes, including theme selection, venue setup, activity arrangement, and more.",
  keywords: "birthday party ideas, birthday party planning, children birthday party, adult birthday party, party themes, birthday activities, party planner, celebration planning",
  openGraph: {
    title: "Birthday Party Creative Planning Tool - Professional Party Planner",
    description: "Get your exclusive birthday party creative plan in minutes and make every birthday an unforgettable memory.",
    type: "website"
  }
};

export default function PartyPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 