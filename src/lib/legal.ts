import { company } from "@/lib/company";

export type LegalSection = { h: string; p: string[] };

export const privacySections: LegalSection[] = [
  { h: "Who we are", p: [
    `${company.name} (we, us) is the responsible party for personal information collected through this website. Registration number: ${company.regNo}. Information Officer: ${company.infoOfficer}. You can contact us at ${company.email}.`] },
  { h: "What we collect", p: [
    "When you use our forms we collect your name, email address, phone number and the details you give us, such as travel dates, destinations, number of travellers, budget, company details and your message.",
    "We do not collect payment card details on this website. Please do not send ID or passport numbers through our forms. If we need them to make a booking we will ask you to share them securely."] },
  { h: "Why we use it", p: [
    "To reply to your enquiry, prepare quotes, make bookings with airlines, hotels and other suppliers on your behalf, issue invoices and keep records we are required to keep.",
    "We only send you news or offers if you agree to receive them, and you can unsubscribe at any time."] },
  { h: "Who we share it with", p: [
    "We share the information needed to complete your booking with the relevant suppliers, such as airlines, hotels and tour operators.",
    "We use service providers to run this website: email delivery (Resend), hosting (Vercel) and, if enabled, privacy-friendly analytics (Plausible), which does not use cookies or track you across other sites. We do not sell your personal information."] },
  { h: "Transfers outside South Africa", p: [
    "Some suppliers and service providers are outside South Africa. We share only what is needed and take reasonable steps to make sure your information stays protected."] },
  { h: "How long we keep it", p: [
    "We keep enquiry and booking information for as long as we need it to deal with your request and meet legal record-keeping duties, and then delete or de-identify it."] },
  { h: "Security", p: [
    "We use reasonable technical and organisational measures, including encrypted connections and restricted access. No system is completely secure, so please take care what you send online."] },
  { h: "Your rights", p: [
    `Under the Protection of Personal Information Act (POPIA) you may ask us what information we hold about you, ask us to correct or delete it, object to how we use it, and withdraw your consent. Email ${company.email} and we will respond.`] },
  { h: "Complaints", p: [
    "If you are unhappy with how we handle your information, please contact us first. You also have the right to complain to the Information Regulator (South Africa) at inforegulator.org.za."] },
  { h: "Children", p: [
    "Our services are for adults. Bookings for children are made by a parent or guardian."] },
  { h: "Changes to this policy", p: [
    "We may update this policy from time to time. The date at the top shows when it was last changed."] },
];

export const termsSections: LegalSection[] = [
  { h: "About these terms", p: [
    `These terms apply to your use of this website and to enquiries and bookings made with ${company.name} (registration number ${company.regNo}). By using the website you agree to them.`] },
  { h: "Our role", p: [
    "We act as an agent between you and travel suppliers such as airlines, hotels and tour operators. The supplier provides the actual service and its own terms apply to it. We will tell you about important supplier conditions in your quote."] },
  { h: "Prices and estimates", p: [
    "Prices and estimated totals on this website are indicative, in South African rand, and subject to availability. A price is only confirmed when we send you a written quote or invoice. Prices can change until your booking is confirmed, especially for flights and foreign-currency costs."] },
  { h: "How booking works", p: [
    "Submitting a request on this website is not a confirmed booking and does not take payment. We check availability and send you a quote. Once you approve it we send an invoice with payment details. Your booking is confirmed when we receive payment and send you written confirmation."] },
  { h: "Payment", p: [
    "Payment is made by EFT or another method stated on your invoice, by the due date shown. We may release or cancel a booking if payment is not received in time."] },
  { h: "Changes and cancellations", p: [
    "Changes and cancellations are subject to the supplier's conditions. Flight tickets and some accommodation may be non-refundable or carry penalties. The applicable conditions and any administration fee we charge will be shown on your quote. Please tell us in writing as soon as you need to change or cancel."] },
  { h: "Travel documents, health and insurance", p: [
    "You are responsible for valid passports, visas, health requirements and other documents needed for your trip, and for checking entry rules for each destination. We strongly recommend comprehensive travel insurance."] },
  { h: "Liability", p: [
    "To the extent the law allows, we are not responsible for the acts or omissions of suppliers or for events outside our control, such as weather, strikes, airline schedule changes or government actions. Nothing in these terms limits your rights under the Consumer Protection Act 68 of 2008 or any other law that cannot be limited."] },
  { h: "Website content", p: [
    "We work to keep the website accurate, but information, photos and listings may change or contain errors. Images are for illustration."] },
  { h: "Complaints", p: [
    `If something goes wrong, please contact us at ${company.email} so we can try to put it right.`] },
  { h: "Governing law", p: [
    "These terms are governed by the laws of the Republic of South Africa."] },
  { h: "Changes to these terms", p: [
    "We may update these terms. The version on this website, with the date shown at the top, applies to new enquiries and bookings."] },
];
