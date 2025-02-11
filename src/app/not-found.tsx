"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <main className="h-screen w-full flex items-center justify-center bg-white p-4">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        {/* Glitch Effect Numbers */}
        <div className="relative">
          <h1 className="text-[150px] md:text-[200px] font-bold text-black opacity-10 select-none">
            404
          </h1>
          <h1
            className="text-[150px] md:text-[200px] font-bold text-black absolute top-0 left-1/2 -translate-x-1/2 select-none
            animate-pulse"
          >
            404
          </h1>
        </div>

        {/* Message */}
        <div className="space-y-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-black">
            Page not found
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button
            onClick={() => router.push("/")}
            size="lg"
            className="hover:scale-105 
              transition-all duration-150 group"
          >
            <MoveLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Button>
        </div>
      </div>
    </main>
  );
}
