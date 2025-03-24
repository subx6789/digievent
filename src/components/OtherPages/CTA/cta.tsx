import {
  ArrowRight,
  Calendar,
  Clapperboard,
  Sparkles,
  TicketCheck,
} from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { landing_content } from "@/utils/data/landing_content";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* CTA background elements */}
      <div className="absolute inset-0 bg-blue-50/30 dark:bg-blue-950/20 -z-10"></div>

      {/* Decorative elements */}
      <motion.div
        className="absolute bottom-20 left-10 w-72 h-72 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl"
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
          className="relative bg-blue-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
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
                viewport={{ once: false }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-sm font-medium text-white flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  {landing_content.cta.badge}
                </span>
              </motion.div>

              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4 relative z-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {landing_content.cta.title}
              </motion.h2>

              <motion.p
                className="text-xl opacity-90 mb-8 max-w-md relative z-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {landing_content.cta.description}
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 group shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-150 h-11 md:w-[200px] w-full"
                  >
                    {landing_content.cta.primaryButton}
                    <motion.span
                      className="ml-1"
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="h-4 w-4" />
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
                    {landing_content.cta.secondaryButton}
                  </Button>
                </Link>
              </motion.div>
            </div>

            <motion.div
              className="hidden md:flex justify-center items-center h-full"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
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
                        Digievent
                      </span>
                      <div className="text-xs text-white/70 mt-0.5">
                        Entry Ticket
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
  );
};

export default CTA;
