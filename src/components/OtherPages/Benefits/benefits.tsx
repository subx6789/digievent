"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";
import { landing_content } from "@/utils/data/landing_content";

interface BenefitsProps {
  sectionRef: React.RefObject<HTMLElement>;
}

export const Benefits = ({ sectionRef }: BenefitsProps) => {
  return (
    <section
      id="benefits"
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
    >
      {/* Benefits section background */}
      <div className="absolute inset-0 bg-blue-50/30 dark:bg-blue-950/20 -z-10"></div>

      {/* Decorative elements */}
      <div className="hidden dark:block">
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 bg-blue-900/20 rounded-full blur-3xl"
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
      </div>

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
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
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
  );
};

export default Benefits;
