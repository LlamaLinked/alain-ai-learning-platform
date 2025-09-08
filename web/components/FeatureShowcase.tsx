import Link from "next/link";

const features = [
  {
    title: "Generate from any HF model",
    body: "Paste a model URL or id — get a guided, interactive notebook tailored to its task.",
  },
  {
    title: "Hands-on, not just theory",
    body: "Experiment with prompts, code, and evaluation right inside the lesson.",
  },
  {
    title: "Share and remix",
    body: "Save tutorials, fork examples, and customize difficulty for your team.",
  },
];

export default function FeatureShowcase() {
  return (
    <section className="reveal mx-auto max-w-6xl px-6 py-12">
      <h2 className="text-center text-2xl font-semibold">What you can do</h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-gray-600">
        Explore interactive lessons built from real models, with safe defaults and helpful context.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {features.map((f) => (
          <article
            key={f.title}
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <h3 className="text-base font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{f.body}</p>
            <div className="mt-4 h-24 rounded-lg border border-dashed border-gray-200 bg-gray-50 text-center text-[11px] leading-[6rem] text-gray-400">
              Interactive preview
            </div>
          </article>
        ))}
      </div>

      {/* Model preview UI stub */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">meta-llama/Llama-2-7b-chat-hf</div>
            <div className="text-xs text-gray-500">text-generation</div>
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
      </div>
    </section>
  );
}

