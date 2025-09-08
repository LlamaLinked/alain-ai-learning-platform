"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { initScrollDepth, initRevealOnScroll } from "@/lib/metrics";

const SocialProof = dynamic(() => import("@/components/SocialProof"), { ssr: false });
const FeatureShowcase = dynamic(() => import("@/components/FeatureShowcase"), { ssr: false });
const HowItWorks = dynamic(() => import("@/components/HowItWorks"), { ssr: false });
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: false });
const FAQ = dynamic(() => import("@/components/FAQ"), { ssr: false });

export default function Page() {
  useEffect(() => {
    initScrollDepth();
    initRevealOnScroll();
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-0px)] overflow-hidden">
      <Hero />
      <SocialProof />
      <FeatureShowcase />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}
