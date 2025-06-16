import { BenefitsSection } from "@/components/layout/sections/benefits";
import { CommunitySection } from "@/components/layout/sections/community";
import { FAQSection } from "@/components/layout/sections/faq";
import { FeaturesSection } from "@/components/layout/sections/features";
import { FooterSection } from "@/components/layout/sections/footer";
import { HeroSection } from "@/components/layout/sections/hero";
import { PricingSection } from "@/components/layout/sections/pricing";
import { ServicesSection } from "@/components/layout/sections/services";
import { SponsorsSection } from "@/components/layout/sections/sponsors";
import { TeamSection } from "@/components/layout/sections/team";
import { TestimonialSection } from "@/components/layout/sections/testimonial";

export const metadata = {
  title: "Birthday Party Planner - Professional Party Planning Tool",
  description: "Professional birthday party creative tool to help you easily plan the perfect birthday celebration. From theme selection to activity arrangement, make every birthday an unforgettable memory.",
  keywords: "birthday party ideas, birthday party planning, children birthday party, adult birthday party, party themes, birthday celebration activities, party planning, birthday celebration",
  openGraph: {
    type: "website",
    title: "Birthday Party Planner - Make Every Birthday Unique",
    description: "Professional birthday party creative tool to help you easily plan the perfect birthday celebration. From theme selection to activity arrangement, make every birthday an unforgettable memory.",
    images: [
      {
        url: "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
        width: 1200,
        height: 630,
        alt: "Birthday Party Planning Tool - Professional Party Planner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Birthday Party Planner - Professional Planning Tool",
    description: "Professional birthday party creative tool to help you easily plan the perfect birthday celebration. Make every birthday truly unforgettable.",
    images: [
      "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
    ],
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <SponsorsSection />
      <BenefitsSection />
      <FeaturesSection />
      <ServicesSection />
      <TestimonialSection />
      <TeamSection />
      <CommunitySection />
      <PricingSection />
      <FAQSection />
      <FooterSection />
    </>
  );
}
