"use client";
import React from 'react';

type T = { name: string; role: string; quote: string };

const testimonials: T[] = [
  { name: "A. Patel", role: "ML Engineer", quote: "ALAIN helped my team onboard to new LLMs in days, not weeks." },
  { name: "K. Nguyen", role: "Student", quote: "The hands-on lessons demystified model behavior for my coursework." },
  { name: "R. Silva", role: "Data Scientist", quote: "I loved generating tutorials directly from the models we use." },
  { name: "M. Garcia", role: "Professor", quote: "Great for classroom demos—safe, structured, and engaging." },
];

export default function Testimonials() {
  const scrollBy = (container: HTMLDivElement | null, dir: 1 | -1) => {
    if (!container) return;
    container.scrollBy({ left: dir * container.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <section className="reveal mx-auto max-w-6xl px-6 py-12">
      <h2 className="text-center text-2xl font-semibold">What people say</h2>

      <div className="relative mt-6">
        <div
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-1 py-1"
          ref={(el) => {
            // Attach controls
            const prev = el?.parentElement?.querySelector<HTMLButtonElement>("button[data-dir='-1']");
            const next = el?.parentElement?.querySelector<HTMLButtonElement>("button[data-dir='1']");
            prev?.addEventListener("click", () => scrollBy(el, -1));
            next?.addEventListener("click", () => scrollBy(el, 1));
          }}
          aria-label="Testimonials carousel"
          role="region"
        >
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="snap-start shrink-0 basis-[85%] rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:basis-[55%] md:basis-[45%] lg:basis-[32%]"
            >
              <blockquote className="text-sm text-gray-700">“{t.quote}”</blockquote>
              <figcaption className="mt-3 flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1">
          <button
            type="button"
            data-dir="-1"
            className="pointer-events-auto hidden rounded-full border border-gray-200 bg-white/80 p-2 text-gray-700 shadow-sm backdrop-blur hover:bg-white md:inline-flex"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            data-dir="1"
            className="pointer-events-auto hidden rounded-full border border-gray-200 bg-white/80 p-2 text-gray-700 shadow-sm backdrop-blur hover:bg-white md:inline-flex"
            aria-label="Next"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
