import React from 'react';
import Link from "next/link";

const features = [
  { title: "Generate from any HF model", body: "Paste a model URL or id — get a guided, interactive notebook tailored to its task." },
  { title: "Hands-on, not just theory", body: "Experiment with prompts, code, and evaluation right inside the lesson." },
  { title: "Share and remix", body: "Save tutorials, fork examples, and customize difficulty for your team." },
  { title: "Clerk-aware CTAs", body: "Smart sign in/up and routing keep users in flow." },
];

export default function FeatureShowcase() {
  return (
    <section className="reveal mx-auto max-w-6xl px-6 py-12">
      <h2 className="text-center text-2xl font-semibold">What you can do</h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-gray-600">
        Explore interactive lessons built from real models, with safe defaults and helpful context.
      </p>

      {/* Bento grid (Magic UI–style inspiration) */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-6">
        <article className="group md:col-span-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <h3 className="text-base font-semibold">{features[0].title}</h3>
          <p className="mt-1 text-sm text-gray-600">{features[0].body}</p>
          <div className="mt-4 h-28 rounded-lg border border-dashed border-gray-200 bg-gray-50 text-center text-[11px] leading-[7rem] text-gray-400">
            Paste model → preview
          </div>
        </article>
        <article className="group md:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <h3 className="text-base font-semibold">{features[1].title}</h3>
          <p className="mt-1 text-sm text-gray-600">{features[1].body}</p>
          <div className="mt-4 h-28 rounded-lg border border-dashed border-gray-200 bg-gray-50 text-center text-[11px] leading-[7rem] text-gray-400">
            Prompt sandbox
          </div>
        </article>
        <article className="group md:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <h3 className="text-base font-semibold">{features[2].title}</h3>
          <p className="mt-1 text-sm text-gray-600">{features[2].body}</p>
          <div className="mt-4 h-28 rounded-lg border border-dashed border-gray-200 bg-gray-50 text-center text-[11px] leading-[7rem] text-gray-400">
            Share/remix
          </div>
        </article>
        <article className="group md:col-span-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Model preview stub</h3>
              <p className="mt-1 text-sm text-gray-600">Friendly info for a chosen model</p>
            </div>
            <div className="text-xs text-gray-500">❤ 12k</div>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-500">Model card excerpt…</div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-500">Tags: transformers, instruct, chat…</div>
          </div>
          <div className="mt-4 text-right">
            <Link href="/generate" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50">
              Try with your model
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
