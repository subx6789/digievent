"use client";
import { motion } from "framer-motion";
import { TicketCheck } from "lucide-react";

interface LoadingProps {
  fullScreen?: boolean;
}

const Loading = ({ fullScreen = true }: LoadingProps) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "h-screen" : "h-full min-h-[300px]"
      } w-full bg-white dark:bg-gray-950`}
    >
      <SquareLoader />
    </div>
  );
};

const SquareLoader = () => {
  return (
    <motion.div
      className="relative flex items-center gap-3"
      animate={{
        scale: [1, 0.5, 1],
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      <motion.div
        className="w-10 h-10 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white"
        animate={{
          rotate: [0, 360, 0],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <TicketCheck className="w-6 h-6" />
      </motion.div>
      <span className="text-xl font-bold text-black dark:text-white">
        Digievent
      </span>
    </motion.div>
  );
};

export default Loading;
