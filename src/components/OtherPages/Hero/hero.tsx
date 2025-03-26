"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  Clapperboard,
  Sparkles,
  Users,
} from "lucide-react";
import { landing_content } from "@/utils/data/landing_content";

interface HeroProps {
  sectionRef: React.RefObject<HTMLElement>;
}

export const Hero = ({ sectionRef }: HeroProps) => {
  const { theme } = useTheme();
  const heroRef = useRef(null);

  // Mouse position animation for hero gradient
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = (heroRef.current as HTMLElement)?.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center relative overflow-hidden md:pt-48 pt-28 pb-20"
      onMouseMove={handleMouseMove}
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-[100px]"></div>
      </div>

      <motion.div
        ref={heroRef}
        className="container mx-auto px-4 relative z-10"
      >
        {/* Interactive gradient spot that follows mouse */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full radial-pulse blur-[80px] opacity-30 dark:opacity-20 pointer-events-none"
          animate={{
            x: mousePosition.x - 300,
            y: mousePosition.y - 300,
          }}
          transition={{ type: "spring", damping: 15, stiffness: 90 }}
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,1) 0%, rgba(37,99,235,0.4) 40%, rgba(37,99,235,0) 70%)",
            boxShadow: "0 0 80px 10px rgba(37,99,235,0.3)",
          }}
        />

        <div className="flex flex-col md:items-center place-items-start text-center mb-16">
          <motion.div
            className="inline-block mb-6 px-5 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-100 dark:border-blue-800/30 shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              {landing_content.hero.badge}
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-4xl leading-tight md:text-center text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <span className="text-blue-600 dark:text-blue-400">
              {landing_content.hero.title.split(" ")[0]}{" "}
            </span>
            {landing_content.hero.title.split(" ").slice(1).join(" ")}
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl md:text-center text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {landing_content.hero.description}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-16 w-full md:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link href="/login">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white group transition-all shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10 border-0 h-11 px-8 hover:scale-105 duration-150 text-md font-medium md:w-[250px] w-full"
              >
                {landing_content.hero.primaryButton}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="#demo">
              <Button
                size="lg"
                variant="outline"
                className="group border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 h-11 px-8 bg-transparent hover:scale-105 duration-150 transition-all text-md font-medium md:w-[250px] w-full"
              >
                <Clapperboard className="mr-2 h-5 w-5" />
                {landing_content.hero.secondaryButton}
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Main hero image */}
        <motion.div
          className="relative w-full max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="relative">
            {/* Decorative elements */}
            <motion.div
              className="absolute -top-10 -left-10 w-32 h-32 bg-blue-200 dark:bg-blue-800/30 rounded-2xl -z-10 blur-xl"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            ></motion.div>

            <motion.div
              className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-200 dark:bg-blue-800/30 rounded-2xl -z-10 blur-xl"
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            ></motion.div>

            <motion.div
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden"
              whileHover={{
                y: -8,
                boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.25)",
              }}
              transition={{ duration: 0.4 }}
            >
              {/* Status bar with indicators */}
              <div className="px-6 md:py-4 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {landing_content.navigation.statusBar}
                </div>
                <div className="text-xs text-gray-400">●</div>
              </div>

              <div className="relative">
                <Image
                  src={
                    theme === "dark"
                      ? "/Placeholder/landing_hero_dashboard_dark.png"
                      : "/Placeholder/landing_hero_dashboard_light.png"
                  }
                  alt="DigiEvent Dashboard"
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                  priority
                />

                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay"></div>
              </div>
            </motion.div>

            {/* Floating elements */}
            <motion.div
              className="absolute md:block hidden -right-6 top-1/4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {
                      landing_content.navigation.notifications.eventCreated
                        .title
                    }
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {landing_content.navigation.notifications.eventCreated.time}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute md:block hidden -left-6 bottom-1/4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {
                      landing_content.navigation.notifications.registrations
                        .title
                    }
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {
                      landing_content.navigation.notifications.registrations
                        .time
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
