"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * The web driver screen polls every 5 s (the loud push alerts arrive with
 * the Android app in M5). A new open trip plays a short beep.
 */
export function DriverWatch({ openCount }: { openCount: number }) {
  const router = useRouter();
  const previous = useRef(openCount);

  useEffect(() => {
    const timer = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(timer);
  }, [router]);

  useEffect(() => {
    if (openCount > previous.current) beep();
    previous.current = openCount;
  }, [openCount]);

  return null;
}

function beep() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    gain.gain.value = 0.2;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    // sound is best-effort
  }
}

/** "পৌঁছেছি": attach the phone's location, then submit. */
export function GeoButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        const form = event.currentTarget.form;
        if (!form) return;
        const lat = form.elements.namedItem("lat") as HTMLInputElement | null;
        const lng = form.elements.namedItem("lng") as HTMLInputElement | null;
        if (!lat || !lng || !navigator.geolocation) return;
        event.preventDefault();
        navigator.geolocation.getCurrentPosition(
          (position) => {
            lat.value = String(position.coords.latitude);
            lng.value = String(position.coords.longitude);
            form.requestSubmit();
          },
          () => form.requestSubmit(),
          { timeout: 4000 },
        );
      }}
    >
      {children}
    </button>
  );
}
