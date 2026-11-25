import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows: unknown[][]): string {
  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

function last90Days() {
  const from = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  return from.toISOString();
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse("unauthorized", { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "owner") return new NextResponse("forbidden", { status: 403 });

  const type = new URL(request.url).searchParams.get("type") ?? "trips";
  const from = last90Days();

  if (type === "ledger") {
    const { data } = await supabase
      .from("ledger")
      .select(
        "at, driver_id, kind, amount, method, reference, note, trip_id, driver:profiles!ledger_driver_id_fkey(full_name)",
      )
      .gte("at", from)
      .order("at");
    const rows: unknown[][] = [
      ["at", "driver", "kind", "amount", "method", "reference", "note", "trip_id"],
    ];
    for (const entry of data ?? []) {
      const embedded = entry.driver as
        | { full_name?: string }
        | { full_name?: string }[]
        | null;
      const name = Array.isArray(embedded)
        ? embedded[0]?.full_name ?? ""
        : embedded?.full_name ?? "";
      rows.push([
        entry.at,
        name,
        entry.kind,
        entry.amount,
        entry.method,
        entry.reference,
        entry.note,
        entry.trip_id,
      ]);
    }
    return new NextResponse(toCsv(rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="ledger.csv"',
      },
    });
  }

  const { data } = await supabase
    .from("trips")
    .select(
      "code, status, ambulance_type, family_phone, pickup_text, dest_text, distance_km, fare, commission, dispatched_at, accepted_at, completed_at, cancelled_at, cancel_reason, driver_id, driver:profiles!trips_driver_id_fkey(full_name)",
    )
    .gte("created_at", from)
    .order("created_at");

  const rows: unknown[][] = [
    [
      "code",
      "status",
      "ambulance_type",
      "family_phone",
      "pickup",
      "destination",
      "distance_km",
      "fare",
      "commission",
      "dispatched_at",
      "accepted_at",
      "completed_at",
      "cancelled_at",
      "cancel_reason",
      "driver",
    ],
  ];
  for (const trip of data ?? []) {
    const embedded = trip.driver as
      | { full_name?: string }
      | { full_name?: string }[]
      | null;
    const driverName = Array.isArray(embedded)
      ? embedded[0]?.full_name ?? ""
      : embedded?.full_name ?? "";
    rows.push([
      trip.code,
      trip.status,
      trip.ambulance_type,
      trip.family_phone,
      trip.pickup_text,
      trip.dest_text,
      trip.distance_km,
      trip.fare,
      trip.commission,
      trip.dispatched_at,
      trip.accepted_at,
      trip.completed_at,
      trip.cancelled_at,
      trip.cancel_reason,
      driverName,
    ]);
  }

  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="trips.csv"',
    },
  });
}
