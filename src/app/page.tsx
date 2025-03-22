/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Tag,
  Clock,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  ChevronRight,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Sparkles,
  TicketCheck,
  Clapperboard,
} from "lucide-react";
import { landing_content } from "@/utils/data/landing_content";
import { ModeToggle } from "@/components/ThemeToggler/ThemeToggler";

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showScrollProgress, setShowScrollProgress] = useState(false);
  const heroRef = useRef(null);

  // Scroll progress tracking
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Update the scroll event handler to also track if user has scrolled
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if navbar should be hidden
      if (currentScrollY < 100) {
        setHidden(false);
      } else {
        setHidden(currentScrollY > lastScrollY);
      }

      // Set hasScrolled to true once user scrolls
      if (currentScrollY > 50 && !hasScrolled) {
        setHasScrolled(true);
      }

      // Show progress bar when scrolled down
      setShowScrollProgress(currentScrollY > 100);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, hasScrolled]);

  // Refs for intersection observer
  const sectionRefs = {
    hero: useRef(null),
    features: useRef(null),
    benefits: useRef(null),
  };

  // Mouse position animation for hero gradient
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: MouseEvent) => {
    if (!heroRef.current) return;
    const rect = (heroRef.current as HTMLElement)?.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);

    // Set up intersection observer to track active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
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
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 relative overflow-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500 z-[100] origin-left"
        style={{
          scaleX,
          opacity: showScrollProgress ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header/Navigation */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300"
        initial={{ y: 0 }}
        animate={{
          y: hidden ? -100 : lastScrollY < 100 ? 0 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-full px-4 py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 dark:shadow-blue-500/10">
                <TicketCheck className="h-5 w-5 text-white" />
              </div>
              <motion.span
                className="text-xl font-bold"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {landing_content.navigation.logo}
              </motion.span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {landing_content.navigation.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-500 after:transition-all after:duration-300 ${
                    activeSection === link.href.substring(1) &&
                    link.href.startsWith("#")
                      ? "text-blue-600 dark:text-blue-400 after:w-full"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 after:w-0 hover:after:w-full"
                  }`}
                >
                  {link.text}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <ModeToggle />

              {/* Login button - visible only on desktop */}
              <div className="hidden md:block">
                <Link href="/login">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 dark:shadow-blue-500/10 border-0 h-11 px-8 hover:scale-105 duration-150 transition-all">
                    {landing_content.navigation.loginButton}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <motion.button
                className="md:hidden p-2 rounded-md bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full mt-2 left-4 right-4 md:hidden bg-white dark:bg-gray-900 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden"
            >
              <div className="py-4 flex flex-col space-y-1">
                {landing_content.navigation.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium py-2 px-4 mx-2 rounded-lg transition-colors ${
                      activeSection === link.href.substring(1) &&
                      link.href.startsWith("#")
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.text}
                  </Link>
                ))}

                {/* Login button in mobile menu */}
                <div className="px-2 pt-2 mt-2 border-t border-gray-100 dark:border-gray-800/30">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full h-11 flex items-center justify-center">
                      <span>{landing_content.navigation.loginButton}</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section
        id="hero"
        ref={sectionRefs.hero}
        className="min-h-screen flex flex-col justify-center relative overflow-hidden md:pt-48 pt-28 pb-20"
        onMouseMove={(e: React.MouseEvent) =>
          handleMouseMove(e as unknown as MouseEvent)
        }
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
            className="absolute w-[500px] h-[500px] rounded-full radial-pulse blur-[100px] opacity-20 dark:opacity-10 pointer-events-none"
            animate={{
              x: mousePosition.x - 250,
              y: mousePosition.y - 250,
            }}
            transition={{ type: "spring", damping: 15 }}
            style={{
              background:
                "radial-gradient(circle, rgba(37,99,235,1) 0%, rgba(37,99,235,0) 70%)",
            }}
          />

          <div className="flex flex-col items-center text-center mb-16">
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
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-4xl leading-tight"
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
              className="text-xl md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {landing_content.hero.description}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-16"
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
                      {
                        landing_content.navigation.notifications.eventCreated
                          .time
                      }
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

      {/* Features Section */}
      <section
        id="features"
        ref={sectionRefs.features}
        className="py-20 relative bg-gray-50 dark:bg-gray-900"
      >
        {/* Feature section background */}
        <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-950/30 -z-10"></div>

        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-block mb-4 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-100 dark:border-blue-800/30"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                {landing_content.features.badge}
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our product has these{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-blue-600 dark:text-blue-400">
                  powerful features
                </span>
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {landing_content.features.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 grid-cols-1 gap-8">
            {landing_content.features.items.map((feature, index) => {
              const Icon =
                feature.icon === "Calendar"
                  ? Calendar
                  : feature.icon === "Clock"
                  ? Clock
                  : feature.icon === "Tag"
                  ? Tag
                  : feature.icon === "Users"
                  ? Users
                  : CheckCircle;

              return (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 shadow-sm hover:shadow-xl transition-all group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        id="benefits"
        ref={sectionRefs.benefits}
        className="py-20 relative overflow-hidden"
      >
        {/* Benefits section background */}
        <div className="absolute inset-0 bg-blue-50/30 dark:bg-blue-950/20 -z-10"></div>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        ></motion.div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center md:justify-start">
                <motion.div
                  className="inline-block mb-4 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-100 dark:border-blue-800/30 shadow-sm"
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    {landing_content.benefits.badge}
                  </span>
                </motion.div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6 md:text-left text-center">
                <span className="relative inline-block">
                  <span className="relative z-10 text-blue-600 dark:text-blue-400">
                    {landing_content.benefits.title.split(" ")[0]}
                  </span>
                </span>{" "}
                {landing_content.benefits.title.split(" ").slice(1).join(" ")}
              </h2>

              <motion.p
                className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed md:text-left text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {landing_content.benefits.description}
              </motion.p>

              <ul className="space-y-5">
                {landing_content.benefits.items.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-4 group"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ x: 3 }}
                  >
                    <div className="h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                      <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="flex-1 w-full"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group max-w-lg mx-auto lg:max-w-none">
                {/* Floating elements */}
                <motion.div
                  className="absolute -top-6 -right-6 w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl -z-10 blur-md"
                  initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                ></motion.div>

                <motion.div
                  className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-2xl -z-10 blur-md"
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                ></motion.div>

                <motion.div
                  className="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <Image
                    src="/Placeholder/event-placeholder.jpg"
                    alt="Event Management"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden bg-gray-100 dark:bg-gray-900">
        {/* CTA background elements */}
        <div className="absolute inset-0 bg-blue-50/30 dark:bg-blue-950/20 -z-10"></div>

        {/* Decorative elements */}
        <motion.div
          className="absolute bottom-20 left-10 w-72 h-72 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        ></motion.div>

        <div className="container mx-auto px-4">
          <motion.div
            className="relative bg-blue-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            whileHover={{
              boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.4)",
              scale: 1.01,
            }}
          >
            {/* Animated background patterns */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 grid grid-cols-8 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="relative h-full">
                    <div className="absolute inset-0 border-r border-white"></div>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 grid grid-rows-8 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="relative w-full">
                    <div className="absolute inset-0 border-b border-white"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating circles */}
            <motion.div
              className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10"
              animate={{
                y: [0, -10, 0],
                x: [0, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            ></motion.div>

            <motion.div
              className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/10"
              animate={{
                y: [0, 10, 0],
                x: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            ></motion.div>

            <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
              <div className="text-left">
                <motion.div
                  className="inline-block mb-4 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full"
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-sm font-medium text-white flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    {landing_content.cta.badge}
                  </span>
                </motion.div>

                <motion.h2
                  className="text-3xl md:text-4xl font-bold mb-4 relative z-10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {landing_content.cta.title}
                </motion.h2>

                <motion.p
                  className="text-xl opacity-90 mb-8 max-w-md relative z-10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {landing_content.cta.description}
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="bg-white text-blue-600 hover:bg-gray-100 group shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-150 h-11 md:w-[200px] w-full"
                    >
                      {landing_content.cta.primaryButton}
                      <motion.span
                        className="ml-1"
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.span>
                    </Button>
                  </Link>

                  <Link href="/demo">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 group transform transition-all duration-150 h-11 hover:scale-105 bg-transparent hover:text-white md:w-[200px] w-full"
                    >
                      <Clapperboard className="mr-1 h-4 w-4" />
                      {landing_content.cta.secondaryButton}
                    </Button>
                  </Link>
                </motion.div>
              </div>

              <motion.div
                className="hidden md:flex justify-center items-center h-full"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="relative h-64 w-64 flex items-center justify-center">
                  {/* Central glowing orb */}
                  <motion.div
                    className="absolute w-48 h-48 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 blur-xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />

                  {/* Single animated floating ticket - more rectangular shape */}
                  <motion.div
                    className="relative w-96 h-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-xl"
                    initial={{ y: 0 }}
                    animate={{
                      y: [0, -8, 0],
                      rotateY: [0, 3, 0, -3, 0],
                      rotateX: [0, 1, 0, -1, 0],
                      boxShadow: [
                        "0 10px 30px -5px rgba(0, 0, 0, 0.2)",
                        "0 20px 40px -5px rgba(0, 0, 0, 0.3)",
                        "0 10px 30px -5px rgba(0, 0, 0, 0.2)",
                      ],
                    }}
                    transition={{
                      y: {
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      },
                      rotateY: {
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      },
                      rotateX: {
                        duration: 6,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      },
                      boxShadow: {
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      },
                    }}
                    whileHover={{
                      scale: 1.03,
                      rotateY: 0,
                      rotateX: 0,
                      y: -5,
                      transition: { duration: 0.4, ease: "easeOut" },
                    }}
                  >
                    <div className="flex items-center gap-4 mb-5">
                      <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center">
                        <TicketCheck className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="font-bold text-white text-lg">
                          Digievent
                        </span>
                        <div className="text-xs text-white/70 mt-0.5">
                          Entry Ticket
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-2.5">
                        <div className="h-3 bg-white/20 rounded-full w-full"></div>
                        <div className="h-3 bg-white/20 rounded-full w-5/6"></div>
                        <div className="h-3 bg-white/20 rounded-full w-3/4"></div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-white/20"></div>
                          <div className="space-y-1.5">
                            <div className="h-2 w-16 bg-white/30 rounded-md"></div>
                            <div className="h-2 w-12 bg-white/20 rounded-md"></div>
                          </div>
                        </div>
                        <div className="h-8 w-28 bg-white/20 rounded-md"></div>
                      </div>

                      <div className="border-t border-white/10 pt-4 mt-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white/30 flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-white/70" />
                            </div>
                            <div className="space-y-1.5">
                              <div className="h-2 w-20 bg-white/30 rounded-md"></div>
                              <div className="h-2 w-14 bg-white/20 rounded-md"></div>
                            </div>
                          </div>
                          <motion.div
                            className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 15,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <ArrowRight className="h-4 w-4 text-white/70" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">
        {/* Footer background elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <motion.div
              className="col-span-1 md:col-span-2 lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 dark:shadow-blue-500/10">
                  <TicketCheck className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Digievent</span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xs">
                {landing_content.footer.description}
              </p>

              <div className="flex items-center gap-4">
                {[
                  {
                    icon: Twitter,
                    id: 1,
                    link: "https://twitter.com/digievent",
                  },
                  {
                    icon: Instagram,
                    id: 2,
                    link: "https://instagram.com/digievent",
                  },
                  {
                    icon: Linkedin,
                    id: 3,
                    link: "https://linkedin.com/company/digievent",
                  },
                  { icon: Github, id: 4, link: "https://github.com/digievent" },
                ].map((item) => (
                  <motion.a
                    key={item.id}
                    href={item.link}
                    className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    target="_blank"
                  >
                    <item.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="font-semibold text-lg mb-4">Product</h4>
              <ul className="space-y-3">
                {landing_content.footer.links.product.map((item, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                    >
                      <span>{item.name}</span>
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="h-3 w-3" />
                      </motion.span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-3">
                {landing_content.footer.links.company.map((item, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                    >
                      <span>{item.name}</span>
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="h-3 w-3" />
                      </motion.span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="font-semibold text-lg mb-4">Legal</h4>
              <ul className="space-y-3">
                {landing_content.footer.links.legal.map((item, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                    >
                      <span>{item.name}</span>
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="h-3 w-3" />
                      </motion.span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
              {landing_content.footer.copyright}
            </p>

            <div className="flex md:flex-row flex-col items-center gap-6">
              <Link
                href="/privacy-policy"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookie-policy"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
