const steps = [
  { n: 1, title: "Pick a model", desc: "Paste a Hugging Face URL or select a quick start." },
  { n: 2, title: "Generate a lesson", desc: "ALAIN builds a hands-on tutorial tailored to the model." },
  { n: 3, title: "Experiment & learn", desc: "Run examples, tweak prompts, and inspect outputs safely." },
  { n: 4, title: "Share & improve", desc: "Save, fork, and iterate with your team or class." },
];

export default function HowItWorks() {
  return (
    <section className="reveal mx-auto max-w-6xl px-6 py-12">
      <h2 className="text-center text-2xl font-semibold">How it works</h2>
      <ol className="mx-auto mt-6 grid max-w-4xl gap-4 md:grid-cols-4">
        {steps.map((s) => (
          <li key={s.n} className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              {s.n}
            </div>
            <div className="mt-2 text-sm font-semibold">{s.title}</div>
            <div className="mt-1 text-xs text-gray-600">{s.desc}</div>
          </li>
        ))}
      </ol>
    </section>
  );
}

