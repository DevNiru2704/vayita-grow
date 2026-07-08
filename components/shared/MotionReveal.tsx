"use client";

// Fix: Change 'motion/react' to 'framer-motion'
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Calm-confidence reveal: fade + small rise, triggered once in view.
 * Reduced motion collapses to a plain fade. Stagger by passing `delay`.
 */
export function MotionReveal({
  children,
  delay = 0,
  y = 20,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{
        duration: reduceMotion ? 0.15 : 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}