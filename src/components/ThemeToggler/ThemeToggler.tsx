"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/themeStore";
import { useEffect } from "react";

export function ModeToggle() {
  const { theme: nextTheme, setTheme: setNextTheme } = useTheme();
  const { theme: storeTheme, setTheme: setStoreTheme } = useThemeStore();

  // Keep the themes in sync
  useEffect(() => {
    if (nextTheme && nextTheme !== storeTheme) {
      setStoreTheme(nextTheme as "light" | "dark" | "system");
    }
  }, [nextTheme, storeTheme, setStoreTheme]);

  const toggleTheme = () => {
    const newTheme = storeTheme === "dark" ? "light" : "dark";
    setStoreTheme(newTheme);
    setNextTheme(newTheme);
  };

  return (
    <Button
      variant="outline"
      className="bg-transparent"
      size="icon"
      onClick={toggleTheme}
    >
      {storeTheme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
