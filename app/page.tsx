import { BehindThreadsSection } from "@/components/Home/BehindThreadsSection";
import { HeroVideoSection } from "@/components/Home/HeroSection";
import { HorizontalScroll } from "@/components/Home/HorizontalScroll";
import { LatestDropSection } from "@/components/Home/LatestDropSection";
import { NewsletterSection } from "@/components/Home/NewsletterSection";
import { ProofSection } from "@/components/Home/ProofSection/ProofSection";
import { GridWrapper } from "@/components/Reusable/GridWrapper";
import React from "react";

export default function Home() {
  return (
    <div className="relative bg-black min-h-screen">
      <div className="relative z-10">
        <HeroVideoSection/>
        {/* Latest Drop Section */}
        <GridWrapper 
          gridPattern="normal"
          gridOpacity={0.07}
        >
          <LatestDropSection />
        <BehindThreadsSection />
        <HorizontalScroll />

        <ProofSection />
        <NewsletterSection />
        </GridWrapper>


        
      </div>
    </div>
  );
}