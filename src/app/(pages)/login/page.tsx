"use client";

import { OrganizerLoginForm } from "@/components/Forms/OrganizerLoginForm";
import { StudentLoginForm } from "@/components/Forms/StudentLoginForm";
import { landing_content } from "@/utils/data/landing_content";
import { motion } from "framer-motion";
import { School, TicketCheck, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("student");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-[100px]"></div>
        <div
          className={`absolute bottom-1/3 left-1/3 w-96 h-96 rounded-full blur-[100px] transition-colors duration-500 ${
            activeTab === "student"
              ? "bg-blue-400/10 dark:bg-blue-600/5"
              : "bg-indigo-400/10 dark:bg-indigo-600/5"
          }`}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <motion.button
              className="flex items-center gap-2 text-black dark:text-white transition-colors font-bold text-lg"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-white transition-colors duration-300 bg-blue-600`}
              >
                <TicketCheck className="w-5 h-5" />
              </motion.div>
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
            {/* Custom Tabs */}
            <div className="w-full">
              <div className="flex justify-center mb-2">
                <div className="bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-md flex w-full">
                  <button
                    onClick={() => setActiveTab("student")}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium flex-1 transition-all duration-200 ${
                      activeTab === "student"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <School
                      className={`h-4 w-4 ${
                        activeTab === "student"
                          ? "text-white"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    />
                    <span>Student</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("organizer")}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium flex-1 transition-all duration-200 ${
                      activeTab === "organizer"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <User
                      className={`h-4 w-4 ${
                        activeTab === "organizer"
                          ? "text-white"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    />
                    <span>Organizer</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Content with Animation */}
            <div className="relative w-full">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {activeTab === "student" ? (
                  <StudentLoginForm />
                ) : (
                  <OrganizerLoginForm />
                )}
              </motion.div>
            </div>
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
        className={`absolute bottom-0 left-0 w-full h-1 ${
          activeTab === "student" ? "bg-blue-600" : "bg-indigo-600"
        }`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
    </div>
  );
}
