"use client";
import { Variants, motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="grid place-content-center h-screen px-4 py-24">
      <BarLoader />
    </div>
  );
};

const variants = {
  initial: {
    scaleY: 0.5,
    opacity: 0,
  },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 1,
      ease: "circIn",
    },
  },
} as Variants;

const BarLoader = () => {
  return (
    <motion.div
      transition={{
        staggerChildren: 0.25,
      }}
      initial="initial"
      animate="animate"
      className="flex gap-1"
    >
      <motion.div
        variants={variants}
        className="h-36 w-6 rounded-lg bg-blue-600"
      />
      <motion.div
        variants={variants}
        className="h-36 w-6 rounded-lg bg-blue-600"
      />
      <motion.div
        variants={variants}
        className="h-36 w-6 rounded-lg bg-blue-600"
      />
      <motion.div
        variants={variants}
        className="h-36 w-6 rounded-lg bg-blue-600"
      />
      <motion.div
        variants={variants}
        className="h-36 w-6 rounded-lg bg-blue-600"
      />
    </motion.div>
  );
};

export default Loading;
