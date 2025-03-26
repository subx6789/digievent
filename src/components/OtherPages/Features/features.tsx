"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Tag,
  Clock,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { landing_content } from "@/utils/data/landing_content";

interface FeaturesProps {
  sectionRef: React.RefObject<HTMLElement>;
}

export const Features = ({ sectionRef }: FeaturesProps) => {
  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-20 relative bg-gray-100 dark:bg-gray-900"
    >
      {/* Feature section background */}
      <div className="absolute inset-0 bg-blue-50/30 dark:bg-blue-950/20 -z-10"></div>

      <div className="container mx-auto px-4">
        <motion.div
          className="md:text-center text-left mb-16"
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

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our product has these{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-blue-600 dark:text-blue-400">
                powerful features
              </span>
            </span>
          </h2>
          <p className="md:text-xl text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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
  );
};

export default Features;
