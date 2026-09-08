import mysql from "mysql2/promise";

/**
 * One small pool. The account is capped at 700 MB and 20 entry processes, so
 * this stays deliberately tiny — a booking endpoint sees a handful of writes
 * a day, not concurrency.
 */
let pool;

export function getPool() {
  pool ??= mysql.createPool({
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 3,
    charset: "utf8mb4_unicode_ci",
    /*
     * Return DATE/DATETIME as strings. Without this, mysql2 builds a JS Date
     * in the server's local zone, so a trip_date of 2026-09-20 read back as
     * 2026-09-19T18:00Z — a booking silently showing the wrong day.
     */
    dateStrings: true,
  });
  return pool;
}

export async function insertBooking(booking) {
  const [result] = await getPool().execute(
    `INSERT INTO bookings
       (name, phone, vehicle, trip_date, destination, notes, locale, ip, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      booking.name,
      booking.phone,
      booking.vehicle || null,
      booking.date || null,
      booking.destination || null,
      booking.notes || null,
      booking.locale,
      booking.ip ?? null,
      booking.userAgent?.slice(0, 255) ?? null,
    ],
  );
  return result.insertId;
}

export async function listBookings(limit = 100) {
  const [rows] = await getPool().query(
    `SELECT id, created_at, name, phone, vehicle, trip_date, destination, notes, locale
       FROM bookings ORDER BY id DESC LIMIT ?`,
    [limit],
  );
  return rows;
}
