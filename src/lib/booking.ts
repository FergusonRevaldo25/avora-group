import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const person = {
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(120),
  phone: z.string().trim().min(7).max(30).regex(/^[+0-9 ()-]+$/),
  notes: z.string().trim().max(1500).optional(),
};

export const SERVICES = ["flights", "package", "accommodation", "tour", "other"] as const;

export const travelSchema = z.object({
  type: z.literal("travel"),
  service: z.enum(SERVICES),
  destination: z.string().trim().min(2).max(100),
  departDate: isoDate,
  returnDate: z.union([isoDate, z.literal("")]).optional(),
  travellers: z.coerce.number().int().min(1).max(30),
  budget: z.string().trim().max(40).optional(),
  ...person,
});

export const stayBookingSchema = z.object({
  type: z.literal("stay"),
  stayId: z.string().trim().max(40),
  checkIn: isoDate,
  checkOut: isoDate,
  guests: z.coerce.number().int().min(1).max(20),
  ...person,
});

export const bookingSchema = z.discriminatedUnion("type", [travelSchema, stayBookingSchema]);

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

export const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");
