"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

/**
 * Renders its children only once they come within 400 px of the screen.
 *
 * For photos below the first screen. Native loading="lazy" decides its own
 * distance, and on an unknown or slow connection Chrome fetches lazy images
 * 2,500–3,000 px away, which on the home page meant the fleet photos
 * downloaded during the first paint and competed with the font. The frame
 * keeps its size, so nothing moves when the photo arrives. Without
 * JavaScript the photo is in <noscript> and loads as normal.
 */
export function WhenNear({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    // Watch the enclosing section where there is one: a card further along
    // a swipe rail is clipped by the rail, so it would never count as near
    // until swiped into view, then show an empty frame while it loads.
    observer.observe(el.closest("section") ?? el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {near ? children : <noscript>{children}</noscript>}
    </div>
  );
}
