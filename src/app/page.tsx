/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Tag,
  Clock,
  ArrowRight,
  CheckCircle,
  Moon,
  Sun,
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

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const heroRef = useRef(null);

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

  // Parallax effect for hero section
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white to-blue-50 dark:from-gray-950 dark:to-blue-950 text-gray-900 dark:text-gray-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl"></div>

        {/* Grid Pattern Background */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]">
          <div className="absolute inset-0 grid grid-cols-12 gap-4 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="relative h-full">
                <div className="absolute inset-0 border-r border-gray-900/5 dark:border-gray-100/5"></div>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 grid grid-rows-12 gap-4 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="relative w-full">
                <div className="absolute inset-0 border-b border-gray-900/5 dark:border-gray-100/5"></div>
              </div>
            ))}
          </div>
        </div>
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
          className="w-full px-4 py-3 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border-b border-white/20 dark:border-gray-800/20 shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/20 dark:shadow-blue-500/10">
                <TicketCheck className="h-5 w-5 text-white" />
              </div>
              <motion.span
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                Digievent
              </motion.span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {[
                { href: "#hero", text: "Home" },
                { href: "#about", text: "About" },
                { href: "#terms", text: "T&C" },
                { href: "#contact", text: "Contact" },
              ].map((link) => (
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
              <motion.button
                onClick={toggleTheme}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-colors shadow-sm backdrop-blur-sm"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </motion.button>

              <Link href="/login">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md shadow-blue-500/20 dark:shadow-blue-500/10 border-0 h-11">
                  Login
                </Button>
              </Link>

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
              className="absolute top-full mt-2 left-4 right-4 md:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-800/20 shadow-xl overflow-hidden"
            >
              <div className="py-4 flex flex-col space-y-1">
                {[
                  { href: "#hero", text: "Home" },
                  { href: "#about", text: "About" },
                  { href: "/terms", text: "T&C" },
                  { href: "/contact", text: "Contact" },
                ].map((link) => (
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section
        id="hero"
        ref={sectionRefs.hero}
        className="min-h-screen md:pt-0 pt-36 flex items-center relative overflow-hidden"
        onMouseMove={(e: React.MouseEvent) =>
          handleMouseMove(e as unknown as MouseEvent)
        }
      >
        <motion.div
          ref={heroRef}
          style={{ y: heroY, opacity: heroOpacity }}
          className="container mx-auto px-4 relative z-10"
        >
          {/* Interactive gradient spot that follows mouse */}
          <motion.div
            className="absolute w-96 h-96 rounded-full radial-pulse blur-3xl opacity-20 dark:opacity-10 pointer-events-none"
            animate={{
              x: mousePosition.x - 192,
              y: mousePosition.y - 192,
            }}
            transition={{ type: "spring", damping: 15 }}
            style={{
              background:
                "radial-gradient(circle, rgba(79,70,229,1) 0%, rgba(127,156,245,0) 70%)",
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.div
                className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full border border-blue-100 dark:border-blue-800/30 shadow-sm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  {landing_content.hero.badge}
                </span>
              </motion.div>

              <div className="mb-6">
                {landing_content.hero.title.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block mr-2 text-4xl md:text-5xl lg:text-6xl font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  >
                    {i === 0 ? (
                      <span className="relative inline-block">
                        <span className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                          {word}
                        </span>
                      </span>
                    ) : i ===
                      landing_content.hero.title.split(" ").length - 1 ? (
                      <span className="relative inline-block">
                        <span className="relative z-10">{word}</span>
                        <motion.span
                          className="absolute bottom-2 left-0 w-full h-3 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800/50 dark:to-purple-800/50 rounded-lg -z-0"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.7, delay: 0.8 }}
                        ></motion.span>
                      </span>
                    ) : (
                      word
                    )}
                  </motion.span>
                ))}
              </div>

              <motion.p
                className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {landing_content.hero.description}
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Link href="#login">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group transition-all shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10 border-0 h-11 hover:scale-105 duration-150 md:w-[200px] w-full text-center"
                  >
                    {landing_content.hero.primaryButton}
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link href="#demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="group border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 h-11 hover:scale-105 duration-150 transition-all md:w-[200px] w-full"
                  >
                    <Clapperboard className="mr-1 h-4 w-4" />
                    {landing_content.hero.secondaryButton}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative z-10 w-full max-w-lg mx-auto md:mx-0 md:ml-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative w-full">
                {/* Decorative elements */}
                <motion.div
                  className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-blue-300 to-purple-300 dark:from-blue-600/30 dark:to-purple-600/30 rounded-2xl -z-10 blur-md"
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                ></motion.div>

                <motion.div
                  className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-purple-300 to-blue-300 dark:from-purple-600/30 dark:to-blue-600/30 rounded-2xl -z-10 blur-md"
                  initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
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
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      DigiEvent Dashboard
                    </div>
                    <div className="text-xs text-gray-400">●</div>
                  </div>

                  <div className="relative">
                    <Image
                      src="/Placeholder/landing_hero_dashboard.png"
                      alt="DigiEvent Dashboard"
                      width={600}
                      height={400}
                      className="w-full h-auto"
                    />

                    {/* Glassmorphism overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent mix-blend-overlay"></div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator - Desktop (Mouse Animation) */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 dark:text-gray-500 hidden md:flex flex-col items-center text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: hasScrolled ? 0 : 1,
            y: hasScrolled ? -20 : 0,
          }}
          transition={{
            opacity: { duration: 0.5, delay: hasScrolled ? 0 : 1 },
            y: { duration: 0.5 },
          }}
        >
          <motion.div
            className="w-8 h-12 border-2 border-gray-400 dark:border-gray-500 rounded-full flex justify-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <motion.div
              className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-2"
              animate={{ y: [0, 15, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
            />
          </motion.div>
          <span className="mt-2">Scroll to explore</span>
        </motion.div>

        {/* Scroll indicator - Mobile (Hidden) */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 dark:text-gray-500 md:hidden flex flex-col items-center text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
        >
          <span className="sr-only">Scroll to explore</span>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        ref={sectionRefs.features}
        className="py-20 relative"
      >
        {/* Feature section background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent dark:from-transparent dark:via-blue-950/30 dark:to-transparent -z-10"></div>

        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full border border-blue-100 dark:border-blue-800/30"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Built for organizers, colleges and students
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our product has these{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  powerful features
                </span>
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {landing_content.features.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-700/50 shadow-sm hover:shadow-xl transition-all group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/30 to-transparent dark:from-transparent dark:via-purple-950/20 dark:to-transparent -z-10"></div>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 bg-blue-300/10 dark:bg-blue-600/5 rounded-full blur-3xl"
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
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full border border-blue-100 dark:border-blue-800/30 shadow-sm"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  Streamlined workflow
                </span>
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    {landing_content.benefits.title.split(" ")[0]}
                  </span>
                </span>{" "}
                {landing_content.benefits.title.split(" ").slice(1).join(" ")}
              </h2>

              <motion.p
                className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
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
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ x: 3 }}
                  >
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
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
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group max-w-lg mx-auto lg:max-w-none">
                {/* Floating elements */}
                <motion.div
                  className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-blue-300 to-purple-300 dark:from-blue-600/30 dark:to-purple-600/30 rounded-2xl -z-10 blur-md"
                  initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                ></motion.div>

                <motion.div
                  className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-purple-300 to-blue-300 dark:from-purple-600/30 dark:to-blue-600/30 rounded-2xl -z-10 blur-md"
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
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
      <section className="py-20 relative overflow-hidden">
        {/* CTA background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:from-transparent dark:via-blue-950/20 dark:to-transparent -z-10"></div>

        {/* Decorative elements */}
        <motion.div
          className="absolute bottom-20 left-10 w-72 h-72 bg-purple-300/10 dark:bg-purple-600/5 rounded-full blur-3xl"
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
            className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
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
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-sm font-medium text-white flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Limited time offer
                  </span>
                </motion.div>

                <motion.h2
                  className="text-3xl md:text-4xl font-bold mb-4 relative z-10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Ready to simplify your event management?
                </motion.h2>

                <motion.p
                  className="text-xl opacity-90 mb-8 max-w-md relative z-10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Try DigiEvent today and see the difference it makes for your
                  college events.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="bg-white text-blue-600 hover:bg-gray-100 group shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-150 h-11 md:w-[200px] w-full"
                    >
                      Get Started Free
                      <motion.span
                        className="ml-1"
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                      >
                        →
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
                      Watch Demo
                    </Button>
                  </Link>
                </motion.div>
              </div>

              <motion.div
                className="hidden md:flex justify-center items-center h-full"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
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
                          Event Ticket
                        </span>
                        <div className="text-xs text-white/70 mt-0.5">
                          Premium Access
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
      <footer className="py-16 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">
        {/* Footer background elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <motion.div
              className="col-span-1 md:col-span-2 lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/20 dark:shadow-blue-500/10">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  DigiEvent
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xs">
                The all-in-one platform for college event management. Simplify
                planning, boost attendance, and create memorable experiences.
              </p>

              <div className="flex items-center gap-4">
                {[Twitter, Instagram, Linkedin, Github].map((Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="font-semibold text-lg mb-4">Product</h4>
              <ul className="space-y-3">
                {[
                  { name: "Features", href: "/features" },
                  { name: "Pricing", href: "/pricing" },
                  { name: "Watch Demo", href: "/demo" },
                  { name: "Integrations", href: "/integrations" },
                  { name: "FAQ", href: "/faq" },
                ].map((item, index) => (
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
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-3">
                {[
                  { name: "About", href: "/about" },
                  { name: "Blog", href: "/blog" },
                  { name: "Careers", href: "/careers" },
                  { name: "Contact", href: "/contact" },
                  { name: "Partners", href: "/partners" },
                ].map((item, index) => (
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
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="font-semibold text-lg mb-4">Legal</h4>
              <ul className="space-y-3">
                {[
                  { name: "Privacy Policy", href: "/privacy-policy" },
                  { name: "Terms & Conditions", href: "/terms" },
                  { name: "Cookie Policy", href: "/cookie-policy" },
                  { name: "Accessibility", href: "/accessibility" },
                  { name: "Security", href: "/security" },
                ].map((item, index) => (
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
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} DigiEvent. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-6">
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
