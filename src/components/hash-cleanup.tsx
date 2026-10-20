"use client";

import { useEffect } from "react";

/**
 * The "Book" buttons link to /contact/#booking. Left in the address bar, that
 * hash makes every later refresh jump back down to the form, which reads as the
 * page scrolling itself. The browser has already done its one anchor scroll by
 * the time the page loads, so the hash is dropped without moving anything.
 *
 * Only #booking is touched: article contents links keep their own hashes.
 */
export function HashCleanup() {
  useEffect(() => {
    if (window.location.hash !== "#booking") return;

    const clear = window.setTimeout(() => {
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname + window.location.search,
      );
    }, 600);

    return () => window.clearTimeout(clear);
  }, []);

  return null;
}
