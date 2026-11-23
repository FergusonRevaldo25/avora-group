import { z } from "zod";

const email = z.string().trim().toLowerCase().email().max(120);
const phone = z.string().trim().min(7).max(30).regex(/^[+0-9 ()-]+$/);
const person = z.string().trim().min(2).max(80);
const org = z.string().trim().min(2).max(100);
const message = z.string().trim().min(10).max(2000);
const consent = z.literal(true);

export const leadSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("partner"), company: org, contactName: person, email, phone,
    partnerType: z.enum(["Hotel or resort", "Airline", "Tour operator", "Travel agent", "Investor", "Other"]),
    message, consent,
  }),
  z.object({
    type: z.literal("corporate"), company: org, contactName: person, email, phone,
    travellers: z.coerce.number().int().min(1).max(500), message, consent,
  }),
  z.object({
    type: z.literal("waitlist"), name: person, email,
    phone: z.union([phone, z.literal("")]).optional(),
    interest: z.enum(["Investment property", "Holiday property", "Both"]), consent,
  }),
  z.object({ type: z.literal("newsletter"), email, consent }),
]);

export const LEAD_LABELS: Record<string, string> = {
  partner: "partner", corporate: "corporate travel", waitlist: "property waitlist", newsletter: "newsletter",
};
