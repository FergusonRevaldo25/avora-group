"use client";
import { useState } from "react";
import Link from "next/link";
import { field as inputCls, label as labelCls } from "@/components/ui";

type Status = "idle" | "sending" | "sent" | "error";

export type LeadField = {
  name: string; label: string;
  type?: "text" | "email" | "tel" | "number" | "select" | "textarea";
  required?: boolean; wide?: boolean; options?: string[];
  min?: number; max?: number; defaultValue?: string | number;
};

export default function LeadForm({ kind, fields, button, successTitle, successText }:
  { kind: string; fields: LeadField[]; button: string; successTitle: string; successText: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const { consent, ...rest } = raw;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: kind, ...rest, consent: consent === "on" }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "Something went wrong.");
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-gold/40 bg-white/70 p-10 text-center">
        <p className="font-display text-3xl">{successTitle}</p>
        <p className="mt-3 opacity-80">{successText}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.wide || f.type === "textarea" ? "md:col-span-2" : ""}>
            <label htmlFor={f.name} className={labelCls}>{f.label}</label>
            {f.type === "textarea" ? (
              <textarea id={f.name} name={f.name} rows={4} required={f.required} minLength={f.required ? 10 : undefined} maxLength={2000} className={inputCls} />
            ) : f.type === "select" ? (
              <select id={f.name} name={f.name} required={f.required} defaultValue="" className={inputCls}>
                <option value="" disabled>Choose one</option>
                {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input id={f.name} name={f.name} type={f.type ?? "text"} required={f.required}
                min={f.min} max={f.max} defaultValue={f.defaultValue} maxLength={120} className={inputCls} />
            )}
          </div>
        ))}
      </div>

      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

      <label className="flex items-start gap-3 text-sm opacity-80">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[#0f3d33]" />
        <span>I agree to Avora Group contacting me and using my details as described in the <Link href="/privacy" className="underline">Privacy Policy</Link>.</span>
      </label>

      {status === "error" && <p role="alert" className="text-sm text-red-700">{error}</p>}

      <button type="submit" disabled={status === "sending"}
        className="rounded-full bg-forest px-9 py-4 text-xs font-medium tracking-[0.25em] uppercase text-cream shadow-lg transition hover:bg-forest-deep disabled:opacity-60">
        {status === "sending" ? "Sending..." : button}
      </button>
    </form>
  );
}
