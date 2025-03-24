"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, TicketCheck } from "lucide-react";
import { ModeToggle } from "@/components/ThemeToggler/ThemeToggler";
import { landing_content } from "@/utils/data/landing_content";

interface NavbarProps {
  activeSection?: string;
}

const Navbar = ({ activeSection = "hero" }: NavbarProps) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showScrollProgress, setShowScrollProgress] = useState(false);

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

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500 z-[100] origin-left"
        style={{
          scaleX,
          opacity: showScrollProgress ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Navbar/Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300"
        initial={{ y: 0 }}
        animate={{
          y: hidden ? -100 : lastScrollY < 100 ? 0 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-full px-4 py-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="container mx-auto flex items-center justify-between">
            {/* Logo with hover animation */}
            <Link href={"/"}>
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/90 backdrop-filter backdrop-blur-sm text-white mr-2"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <TicketCheck className="h-5 w-5" />
                </motion.div>
                <span className="text-lg font-bold text-gray-800 dark:text-white">
                  {landing_content.navigation.logo}
                </span>
              </motion.div>
            </Link>

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
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ModeToggle />
              </motion.div>

              {/* Login button - visible only on desktop */}
              <div className="hidden md:block">
                <Link href="/login">
                  <Button className="bg-blue-600/90 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 dark:shadow-blue-500/10 border-0 h-11 px-8 hover:scale-105 duration-150 transition-all backdrop-blur-sm">
                    {landing_content.navigation.loginButton}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <motion.button
                className="md:hidden p-2 rounded-md bg-white/30 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
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
              className="absolute top-full mt-2 left-4 right-4 md:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl overflow-hidden"
            >
              <div className="py-4 flex flex-col space-y-1">
                {landing_content.navigation.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium py-2 px-4 mx-2 rounded-lg transition-colors ${
                      activeSection === link.href.substring(1) &&
                      link.href.startsWith("#")
                        ? "bg-blue-50/70 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.text}
                  </Link>
                ))}

                {/* Login button in mobile menu */}
                <div className="px-2 pt-2 mt-2 border-t border-gray-100/50 dark:border-gray-800/30">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="bg-blue-600/90 hover:bg-blue-700 text-white w-full h-11 flex items-center justify-center backdrop-blur-sm">
                      <span>{landing_content.navigation.loginButton}</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;
