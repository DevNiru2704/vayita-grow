"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Counts up to `value` when first scrolled into view. Renders the final
 * value immediately for reduced-motion users (and before hydration).
 */
export function AnimatedNumber({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const reduceMotion = useReducedMotion();
  const formatter = new Intl.NumberFormat("en-IN");

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        node.textContent = `${formatter.format(Math.round(latest))}${suffix}`;
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion, value, suffix]);

  return (
    <span ref={ref} className={className}>
      {formatter.format(value)}
      {suffix}
    </span>
  );
}
