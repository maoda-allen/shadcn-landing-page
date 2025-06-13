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
  title: "创意生日派对策划 - Birthday Party Ideas | 专业派对策划工具",
  description: "专业的生日派对创意策划平台，提供儿童生日、成人生日、长辈生日等个性化派对方案。从主题选择到活动安排，让每个生日都独一无二。",
  keywords: "birthday party ideas,生日派对创意,生日派对策划,儿童生日派对,成人生日聚会,派对主题,生日庆祝活动",
  openGraph: {
    type: "website",
    title: "创意生日派对策划 - 让每个生日都独一无二",
    description: "专业的生日派对创意工具，帮您轻松策划完美的生日庆典",
    images: [
      {
        url: "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
        width: 1200,
        height: 630,
        alt: "生日派对策划工具",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "创意生日派对策划 - Birthday Party Ideas",
    description: "专业的生日派对创意工具，帮您轻松策划完美的生日庆典",
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
