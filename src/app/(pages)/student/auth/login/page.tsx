"use client";

import { StudentLoginForm } from "@/components/Forms/StudentLoginForm";
import { landing_content } from "@/utils/data/landing_content";
import { motion } from "framer-motion";
import { TicketCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <motion.button
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold"
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white">
                <TicketCheck className="size-4" />
              </div>
              Digievent
            </motion.button>
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full py-12">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StudentLoginForm />
          </motion.div>
        </div>

        {/* Footer */}
        <div className="py-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {landing_content.footer.copyright}
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
    </div>
  );
}
