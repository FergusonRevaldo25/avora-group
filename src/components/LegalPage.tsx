import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { company } from "@/lib/company";
import type { LegalSection } from "@/lib/legal";

export default function LegalPage({ title, sections }: { title: string; sections: LegalSection[] }) {
  return (
    <main>
      <SiteNav />
      <article className="mx-auto max-w-3xl px-6 pb-24 pt-36">
        <h1 className="font-display text-5xl">{title}</h1>
        <p className="mt-2 text-sm opacity-60">Last updated: {company.lastUpdated}</p>
        {sections.map((s) => (
          <section key={s.h} className="mt-10">
            <h2 className="font-display text-2xl">{s.h}</h2>
            {s.p.map((t, i) => <p key={i} className="mt-3 leading-relaxed opacity-85">{t}</p>)}
          </section>
        ))}
      </article>
      <SiteFooter />
    </main>
  );
}
