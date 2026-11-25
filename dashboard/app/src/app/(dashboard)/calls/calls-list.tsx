"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { markNoTrip } from "./actions";

export type CallRow = {
  id: string;
  caller_number: string;
  direction: "incoming" | "outgoing" | "missed" | "rejected";
  started_at: string;
  duration_sec: number;
  handled: boolean;
  outcome_note: string | null;
  source: string;
  created_at: string;
};

const DIRECTION_LABEL: Record<string, string> = {
  incoming: "ইনকামিং / Incoming",
  outgoing: "আউটগোয়িং / Outgoing",
  missed: "মিসড / Missed",
  rejected: "রিজেক্টেড / Rejected",
};

function sortCalls(calls: CallRow[]): CallRow[] {
  return [...calls].sort((a, b) => {
    if (a.handled !== b.handled) return a.handled ? 1 : -1;
    return new Date(b.started_at).getTime() - new Date(a.started_at).getTime();
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("bn-BD", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(sec: number): string {
  if (sec < 60) return `${sec} সে`;
  return `${Math.floor(sec / 60)} মি ${sec % 60} সে`;
}

export function CallsList({
  initialCalls,
  tripCounts,
}: {
  initialCalls: CallRow[];
  tripCounts: Record<string, number>;
}) {
  const [calls, setCalls] = useState<CallRow[]>(() => sortCalls(initialCalls));
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const channel = supabase
      .channel("calls-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "calls" },
        (payload) => {
          const row = payload.new as CallRow;
          setCalls((prev) =>
            prev.some((c) => c.id === row.id)
              ? prev
              : sortCalls([row, ...prev]).slice(0, 100),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "calls" },
        (payload) => {
          const row = payload.new as CallRow;
          setCalls((prev) => sortCalls(prev.map((c) => (c.id === row.id ? row : c))));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const missed = calls.filter((c) => !c.handled && c.direction === "missed").length;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900">সাম্প্রতিক কল / Recent calls</h2>
        {missed > 0 ? (
          <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
            {missed} মিসড কল অপেক্ষমাণ
          </span>
        ) : null}
      </div>

      {calls.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-white px-4 py-8 text-center text-sm text-zinc-500">
          এখনও কোনো কল নেই / No calls yet — a call to the business number shows up here
        </p>
      ) : null}

      {calls.map((call) => {
        const urgent = !call.handled && call.direction === "missed";
        return (
          <article
            key={call.id}
            className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border bg-white p-4 ${
              urgent ? "border-red-300 bg-red-50/40" : "border-zinc-200"
            }`}
          >
            <div className="min-w-40">
              <a
                href={`tel:${call.caller_number}`}
                className={`text-base font-semibold hover:underline ${
                  urgent ? "text-red-800" : "text-zinc-900"
                }`}
              >
                {call.caller_number}
              </a>
              <p className="text-xs text-zinc-500">
                {call.handled ? "সম্পন্ন / Handled" : "অপেক্ষমাণ / Open"} · {call.source}
              </p>
            </div>

            <div className="text-sm text-zinc-600">
              <p>{formatTime(call.started_at)}</p>
              <p className="text-xs text-zinc-500">
                {DIRECTION_LABEL[call.direction] ?? call.direction} ·{" "}
                {formatDuration(call.duration_sec)}
              </p>
            </div>

            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
              {tripCounts[call.caller_number] ?? 0}টি আগের ট্রিপ
            </span>

            {call.handled ? (
              <p className="text-sm text-zinc-500">{call.outcome_note ?? ""}</p>
            ) : (
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <a
                  href={`/trips/new?call=${call.id}`}
                  className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  ট্রিপ করুন / Create trip
                </a>
                <form action={markNoTrip} className="flex items-center gap-2">
                  <input type="hidden" name="call_id" value={call.id} />
                  <input
                    name="outcome_note"
                    required
                    placeholder="কারণ / Reason"
                    className="w-40 rounded-lg border border-zinc-300 px-2 py-1.5 text-sm"
                  />
                  <button
                    type="submit"
                    className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100"
                  >
                    ট্রিপ নয় / No trip
                  </button>
                </form>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}
