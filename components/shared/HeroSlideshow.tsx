"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

/**
 * Hero product slideshow: crossfades through the catalog in a random order.
 * Reduced motion shows a single static product with no auto-advance.
 */

export type HeroSlide = { src: string; name: string; categoryName: string };

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroSlideshow({
  slides,
  intervalMs = 4200,
}: {
  slides: HeroSlide[];
  intervalMs?: number;
}) {
  const reduce = useReducedMotion();
  // Randomise once per mount so each page load leads with a different product.
  const order = useMemo(() => shuffle(slides), [slides]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || order.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % order.length), intervalMs);
    return () => clearInterval(id);
  }, [reduce, order.length, intervalMs]);

  if (order.length === 0) return null;
  const current = order[index];

  return (
    <div className="relative mx-auto flex h-105 w-full max-w-md items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.src}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            src={current.src}
            alt={`${current.name} product pack`}
            fill
            priority
            className="object-contain p-10 drop-shadow-2xl"
            sizes="(max-width: 1024px) 0px, 28rem"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
        <AnimatePresence mode="wait">
          <motion.p
            key={`${current.src}-caption`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
            className="whitespace-nowrap rounded-full bg-brand-900/80 px-4 py-1.5 text-xs font-medium tracking-wide text-brand-200"
          >
            {current.name} · {current.categoryName}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
