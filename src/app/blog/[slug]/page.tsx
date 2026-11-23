import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { posts } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  return post ? { title: `${post.title} | Avora Group`, description: post.excerpt } : {};
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  const date = new Date(post.date).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <main>
      <SiteNav />
      <article className="mx-auto max-w-3xl px-6 pb-24 pt-36">
        <p className="text-xs tracking-[0.3em] uppercase text-gold">{date}</p>
        <h1 className="mt-3 font-display text-4xl leading-tight md:text-6xl">{post.title}</h1>
        <div className="relative mt-10 h-72 overflow-hidden rounded-2xl md:h-96">
          <Image src={post.img} alt="" fill priority sizes="(min-width: 768px) 48rem, 100vw" className="object-cover" />
        </div>
        <div className="mt-10">
          {post.body.map((b, i) => (
            <section key={i} className="mt-6">
              {b.h && <h2 className="font-display text-2xl">{b.h}</h2>}
              <p className="mt-2 text-lg leading-relaxed opacity-85">{b.p}</p>
            </section>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap gap-4">
          <Link href="/travel#request" className="rounded-full bg-forest px-8 py-4 text-xs tracking-[0.25em] uppercase text-cream transition hover:bg-forest-deep">Plan my trip</Link>
          <Link href="/blog" className="rounded-full border border-forest px-8 py-4 text-xs tracking-[0.25em] uppercase transition hover:bg-forest hover:text-cream">All articles</Link>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
