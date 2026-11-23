import { MessageCircle } from "lucide-react";
import { company } from "@/lib/company";

export default function WhatsAppButton() {
  const href = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent("Hi Avora Group, I would like to enquire about a trip.")}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp"
      style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))" }}
      className="fixed right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-110">
      <MessageCircle size={28} />
    </a>
  );
}
