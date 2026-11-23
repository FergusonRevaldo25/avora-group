import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { privacySections } from "@/lib/legal";

export const metadata: Metadata = { title: "Privacy Policy | Avora Group" };

export default function Page() {
  return <LegalPage title="Privacy Policy" sections={privacySections} />;
}
