"use client";
import React from 'react';
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { trackCtaClick } from "@/lib/metrics";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-20 text-center md:py-28">
      {/* Animated, GPU-friendly background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="blob-1 absolute left-1/2 top-[-20%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.22),rgba(79,70,229,0)_60%)] blur-3xl" />
        <div className="blob-2 absolute right-[-10%] top-[0%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.18),rgba(59,130,246,0)_60%)] blur-3xl" />
        <div className="blob-3 absolute left-[-10%] bottom-[-10%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(163,230,53,0.12),rgba(163,230,53,0)_60%)] blur-3xl" />
      </div>
      {/* Beams/spotlight overlay */}
      <div aria-hidden className="beams" />

      <div className="mx-auto max-w-3xl">
        <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
          Build AI skills by experimenting with real models
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-gray-600 md:text-lg">
          ALAIN turns model exploration into hands-on lessons. Try a demo or generate a tutorial from any Hugging Face model.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button
                onClick={() => trackCtaClick({ label: "Start Learning", context: "hero_signed_out" })}
                className="focus-ring rounded-full bg-[var(--brand-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-dark)]"
              >
                Start Learning
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/generate"
              onClick={() => trackCtaClick({ label: "Start Learning", context: "hero_signed_in" })}
              className="focus-ring rounded-full bg-[var(--brand-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-dark)]"
            >
              Start Learning
            </Link>
          </SignedIn>

          <Link
            href="/stream"
            onClick={() => trackCtaClick({ label: "View Demo", context: "hero" })}
            className="focus-ring rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
          >
            View Demo
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500">
          <span className="rounded-full border border-gray-200 bg-white px-2 py-1">No installs required</span>
          <span className="rounded-full border border-gray-200 bg-white px-2 py-1">Works with HF models</span>
          <span className="rounded-full border border-gray-200 bg-white px-2 py-1">Accessible & keyboard friendly</span>
        </div>
      </div>
    </section>
  );
}
