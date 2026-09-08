import nodemailer from "nodemailer";

let transport;

function getTransport() {
  transport ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: String(process.env.SMTP_SECURE ?? "true") === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
  return transport;
}

const escape = (v) =>
  String(v ?? "").replace(/[<>&"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c],
  );

/**
 * Notifies the office. Never throws into the request path — a booking that is
 * safely in the database must not be reported as failed because SMTP was
 * briefly unavailable.
 */
export async function sendBookingEmail(booking, id) {
  if (!process.env.SMTP_HOST) return { sent: false, reason: "SMTP not configured" };

  const rows = [
    ["নাম / Name", booking.name],
    ["ফোন / Phone", booking.phone],
    ["গাড়ি / Vehicle", booking.vehicle],
    ["তারিখ / Date", booking.date],
    ["গন্তব্য / Destination", booking.destination],
    ["নোট / Notes", booking.notes],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td><strong>${escape(k)}</strong></td><td>${escape(v)}</td></tr>`)
    .join("");

  try {
    await getTransport().sendMail({
      from: process.env.MAIL_FROM ?? process.env.SMTP_USER,
      to: process.env.MAIL_TO ?? "booking@rajshahirentacar.bd",
      replyTo: undefined,
      subject: `নতুন বুকিং #${id} — ${booking.name} (${booking.phone})`,
      html: `<h2>নতুন বুকিং / New booking #${id}</h2><table>${rows}</table>`,
    });
    return { sent: true };
  } catch (error) {
    console.error("[booking] email failed", error);
    return { sent: false, reason: "send failed" };
  }
}
