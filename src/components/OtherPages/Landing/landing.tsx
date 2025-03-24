/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useRef } from "react";
import Hero from "@/components/OtherPages/Hero/hero";
import Features from "@/components/OtherPages/Features/features";
import Benefits from "@/components/OtherPages/Benefits/benefits";
import CTA from "@/components/OtherPages/CTA/cta";

interface LandingProps {
  onSectionChange: (section: string) => void;
}

export default function Landing({ onSectionChange }: LandingProps) {
  const [mounted, setMounted] = useState(false);

  // Refs for intersection observer with proper typing
  const sectionRefs = {
    hero: useRef<HTMLElement>(null),
    features: useRef<HTMLElement>(null),
    benefits: useRef<HTMLElement>(null),
  };

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);

    // Set up intersection observer to track active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onSectionChange(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    Object.values(sectionRefs).forEach(
      (ref) => ref.current && observer.observe(ref.current)
    );

    return () => {
      Object.values(sectionRefs).forEach(
        (ref) => ref.current && observer.unobserve(ref.current)
      );
    };
  }, [onSectionChange]);

  if (!mounted) return null;

  return (
    <>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <Hero sectionRef={sectionRefs.hero as React.RefObject<HTMLElement>} />

      {/* Features Section */}
      <Features
        sectionRef={sectionRefs.features as React.RefObject<HTMLElement>}
      />

      {/* Benefits Section */}
      <Benefits
        sectionRef={sectionRefs.benefits as React.RefObject<HTMLElement>}
      />

      {/* CTA Section */}
      <CTA />
    </>
  );
}
