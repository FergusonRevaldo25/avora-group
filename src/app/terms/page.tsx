import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { termsSections } from "@/lib/legal";

export const metadata: Metadata = { title: "Terms and Cancellation Policy | Avora Group" };

export default function Page() {
  return <LegalPage title="Terms and Cancellation Policy" sections={termsSections} />;
}
