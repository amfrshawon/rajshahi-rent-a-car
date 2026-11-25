"use client";

import { useEffect, useState } from "react";

export function Elapsed({ since }: { since: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = Math.max(0, Math.floor((now - new Date(since).getTime()) / 1000));
  const text =
    seconds < 60
      ? `${seconds}s`
      : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;

  return (
    <span suppressHydrationWarning className="text-xs tabular-nums text-zinc-500">
      {text}
    </span>
  );
}
