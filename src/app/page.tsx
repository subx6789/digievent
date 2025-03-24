"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/OtherPages/Navbar/navbar";
import Footer from "@/components/OtherPages/Footer/footer";
import Landing from "@/components/OtherPages/Landing/landing";
import Loading from "@/components/Loading/Loading";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Prevent hydration mismatch and ensure components are fully mounted
  useEffect(() => {
    // Increase timeout to ensure all components are fully hydrated
    const timer = setTimeout(() => {
      setMounted(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Use a simple loading state while waiting for hydration
  if (!mounted) {
    return (
      <div className="min-h-screen w-full bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-pulse">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 relative overflow-hidden">
      {/* Navbar Component */}
      <Navbar activeSection={activeSection} />

      {/* Main Content */}
      <main>
        <Landing onSectionChange={setActiveSection} />
      </main>

      {/* Footer */}
      <Footer key="footer-component" />
    </div>
  );
}
