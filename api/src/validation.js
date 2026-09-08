import { z } from "zod";

/**
 * Bangladeshi mobile numbers: 11 digits starting 01, optionally written with
 * +880 or 880. Accepts spaces and dashes, which people type constantly.
 */
const phone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .refine((v) => /^(?:\+?880|0)1[3-9]\d{8}$/.test(v), {
    message: "সঠিক মোবাইল নম্বর দিন / Enter a valid mobile number",
  });

export const bookingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "নাম লিখুন / Enter your name" })
    .max(120),
  phone,
  vehicle: z.string().trim().max(80).optional().or(z.literal("")),
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  destination: z.string().trim().max(200).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  locale: z.enum(["bn", "en"]).default("bn"),
  /**
   * Honeypot. Deliberately permissive: rejecting it here would return a
   * validation error naming the field, which tells a bot the trap exists.
   * The handler checks it after parsing and silently returns success.
   */
  website: z.string().max(200).optional(),
});
