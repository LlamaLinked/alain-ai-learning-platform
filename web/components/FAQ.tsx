import React from 'react';
type QA = { q: string; a: string };

const faqs: QA[] = [
  { q: "Do I need to install anything?", a: "No. ALAIN runs in the browser with server-side helpers." },
  { q: "Is this free?", a: "There is a free tier. Contact us for education and team plans." },
  { q: "Which models are supported?", a: "Use any public Hugging Face model. Private models may require auth." },
  { q: "Can I share lessons?", a: "Yes. Save and share links. Teams can fork and remix." },
];

export default function FAQ() {
  return (
    <section className="reveal mx-auto max-w-3xl px-6 py-12">
      <h2 className="text-center text-2xl font-semibold">FAQ</h2>
      <div className="mt-6 space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <summary className="cursor-pointer list-none text-sm font-semibold">
              <span className="mr-2 inline-block h-4 w-4 rounded-full border border-gray-300 text-center text-[10px] leading-4 transition group-open:rotate-45">+</span>
              {f.q}
            </summary>
            <div className="mt-2 text-sm text-gray-600">{f.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

