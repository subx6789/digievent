"use client";

import React from "react";
import { motion } from "framer-motion";
import { TicketCheck } from "lucide-react";
import { landing_content } from "@/utils/data/landing_content";
import Link from "next/link";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link href={"/"}>
            <motion.div
              className="flex items-center mb-4 md:mb-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white mr-2"
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
          <motion.div
            className="text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {landing_content.footer.copyright}
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
